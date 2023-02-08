// This file defines the graph component that represents the family tree. It is
// build using cytoscape, a js graphing library, using the cola layout.

import { useEffect, useState } from "react";

import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import cola from "cytoscape-cola";
import Icon from "src/components/Icon/Icon";

import "./Tree.scss";

cytoscape.use(cola);

export default function Tree(props) {
    const [cytoRef, setCytoRef] = useState(null);
    const [cyto, setCyto] = useState(null);

    useEffect(() => {
        setCyto(renderCyto())
    }, [props]);

    // Pans to a node and its close relatives.
    function panCloseRelatives(el, cy) {
        function neighborNodes(node) {
            return node.neighborhood((ele) => { return ele.isNode(); });
        }

        function closeRelatives(all, node, nn) {
            let ns = neighborNodes(node);
            all = all.union(ns);

            ns.forEach((x) => { all = all.union(neighborNodes(x)) });

            return all.filter(function (ele) { return !ele.data().r === "mrg"; });
        }

        function select(node, cy) {
            let sel = cy.elements("node:selected");
            sel.forEach((x) => { x.unselect() });
            node.select();
        }

        if (el.isEdge()) { return; }

        let all = el.collection();
        let neigh = closeRelatives(all, el);
        select(el, cy);

        cy.animate(
            {
                fit: { eles: neigh, padding: 20 },
                center: { eles: el }
            },
            { duration: 900 }
        );

        cy.resize();
    }

    // This is called two times. When the variable is initialized and when
    // cytoscape is initialized.
    useEffect(() => {
        if (!cytoRef) { return; } // Check if cytoscape is initialized.

        // Add listener for top on nodes in the graph.
        cytoRef.on("tap", "node", (event) => {
            props.onSelect(event.target._private.data.id);
        });

        // Zoom out after initial animation.
        setTimeout(() => {
            cytoRef.animate({ fit: { padding: 20 } });
            cytoRef.resize();
        }, 8000);
    }, [cytoRef]);

    // This is called when the current selected node is changed.
    useEffect(() => {
        // Check if cytoscape is initialized and current selection is set.
        if (!cytoRef || !props.current) { return; }

        let element = cytoRef.getElementById(props.current);
        panCloseRelatives(element, cytoRef);
    }, [props, cytoRef]);

    function renderCyto() {
        if (!props.json) {
            return null;
        }

        let elements = props.json.marriages.concat(props.json.nodes);

        elements = elements.map(
            (val) => { delete val["data"]; return { data: val }; }
        );

        return (<CytoscapeComponent
            cy={cy => { setCytoRef(cy) }}
            elements={elements}
            style={style}
            stylesheet={stylesheet}
            layout={layout}
            minZoom={0.3}
            maxZoom={2}
            autoungrabify={true}
        />);
    }

    return (
        <div className="tree">
            <button className="reload" onClick={() => {
                cytoRef.layout(layout).run()
            }}>
                <Icon className="reload" name="clockwise"></Icon>
            </button>
            {cyto}
        </div>
    );
}

const layout = {
    name: "cola",
    animate: true,
    randomize: true,
    avoidOverlap: true, // if true, prevents overlap of node bounding boxes
    handleDisconnected: true,
    maxSimulationTime: 8000, // max length in ms to run the layout
    ungrabifyWhileSimulating: true, // so you can"t drag nodes during layout
    fit: false, // on every layout reposition of nodes, fit the viewport
    zoom: 1,
    padding: 10, // padding around simulation
    nodeSpacing: function (node) { return 10; },
};

const style = {
    width: "100%",
    height: "100%"
};

const stylesheet = [
    {
        selector: "node[r='mrg']",
        style: {
            "label": "data(l)",
            "text-halign": "center",
            "text-valign": "center",
            "font-size": "30px",
            "background-color": "#ffffff",
        }
    },
    {
        selector: "node[r='prs']",
        style: {
            "font-family": "Playfair",
            "text-background-opacity": 1,
            "label": "data(f)",
            "border-width": "2px",
            "background-color": "#ffffff",
            "text-background-color": "#ffffff",
        }
    },
    {
        selector: "node[r='prs']:selected",
        style: {
            "text-background-opacity": 1,
            "text-background-color": "#ffffff",
            "label": "data(f)",
            "background-color": "#000000",
            "line-color": "black",
            "target-arrow-color": "black",
            "source-arrow-color": "black"
        }
    },
    {
        selector: "edge[r='div']",
        style: {
            width: 6,
            "line-style": "dashed",
            "line-dash-pattern": 6,
            "line-color": "black",
        }
    },
    {
        selector: "edge[r='chl']",
        style: {
            width: 2,
            "line-color": "black",
            "mid-target-arrow-shape": "vee",
            "mid-target-arrow-color": "grey",
            "arrow-scale": 2,
        }
    },
    {
        selector: "edge[r='adopted']",
        style: {
            width: 2,
            "line-color": "black",
            "mid-target-arrow-shape": "vee",
            "mid-target-arrow-color": "grey",
            "arrow-scale": 2,
            "line-style": "dashed",
            "line-dash-pattern": 6,
        }
    },
    {
        selector: "edge[r='mrd'], edge[r='p']",
        style: { width: 6, "line-color": "black" }
    }
];