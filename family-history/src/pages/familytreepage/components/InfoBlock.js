//This file defines the component that gives information about a certain member
// of the family.

import "./InfoBlock.scss";
import Icon from "src/components/Icon/Icon";
import getImageSrc from "src/libs/getImageSrc";

export default function InfoBlock(props) {
    let current = props.json.nodes.find(
        element => element.id === props.current
    );

    if (!current) {
        return null;
    }

    return (
        <>
            <div className="overlay"/>
            <div className="info_block">
                <div className="info_block__content">
                    {current.icon ?
                        <div className="lock__image_wrapper">
                            <img src={getImageSrc(current.icon)} alt="portrait" />
                        </div>
                        :
                        null
                    }
                    <div className="info_block__info_wrapper">
                        <div className="info_block__info_wrapper__name">
                            {current.f ? <p>{current.f}</p> : null}
                            {current.m ? <p>{current.m}</p> : null}
                            {current.l ? <p>{current.l}</p> : null}
                        </div>
                        <div className="info_block__info_wrapper__birth">
                            {current.b || current.pOb ? <p>&#42;</p> : null}
                            {current.b ? <p>{current.b}</p> : null}
                            {current.pOb ? <p>{current.pOb}</p> : null}
                        </div>
                        <div className="info_block__info_wrapper__death">
                            {current.d || current.pOd ? <p>&#8224;</p> : null}
                            {current.d ? <p>{current.d}</p> : null}
                            {current.pOd ? <p>{current.pOd}</p> : null}
                        </div>
                    </div>
                </div>
                <div className="info_block__button_wrapper">
                    <button onClick={() => { props.onDeselect() }}>
                        <Icon name="x"></Icon>
                    </button>
                </div>
            </div>
        </>
    );
}