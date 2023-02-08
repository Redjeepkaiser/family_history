// This file defines the familytreepage. This page provides an overview of the
// familytree in graph form and a menu of all persons on the tree, sorted on
// alphabetical order. This component keep track of the currently selected node
// in the graph and passes this information on to its childern.

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Tree from "./components/Tree";
import Menu from "./components/Menu";
import InfoBlock from "./components/InfoBlock";
import BackButton from "src/components/back_button/BackButton";
import getTree from "src/libs/getTree";

import "./Familytreepage.scss";

export default function Familytreepage() {
    var navigate = useNavigate();
    var [currentSelected, setCurrentSelected] = useState(null);
    const [content, setContent] = useState();

    function handleSelect(id) { setCurrentSelected(id); }
    function handleDeselect() { setCurrentSelected(null); }

    // Navigate to homepage if the tree cannot be loaded.
    useEffect(() => {
        getTree().then(value => {
            setContent(value);
        }).catch(() => {
            navigate("/");
        });
    }, [navigate]);

    return (
        <>
            <BackButton to="/" />
            <div className="family_tree">
                <div className="family_tree__tree_wrapper">
                    <Tree
                        json={content}
                        onSelect={handleSelect}
                        onDeselect={handleDeselect}
                        current={currentSelected}
                    />
                </div>
                <div className="family_tree__menu_wrapper">
                    <Menu
                        json={content}
                        onSelect={handleSelect}
                        onDeselect={handleDeselect}
                        current={currentSelected}
                    />
                </div>
                {currentSelected == null ?
                    null :
                    <div className="family_tree__info_block_wrapper">
                        <InfoBlock
                            json={content}
                            onSelect={handleSelect}
                            onDeselect={handleDeselect}
                            current={currentSelected}
                        />
                    </div>
                }
            </div>
        </>
    );
}