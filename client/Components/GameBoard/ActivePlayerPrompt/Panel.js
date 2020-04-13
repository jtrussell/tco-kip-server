import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import xyDrag from '../../xyDrag';

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.handleRef = React.createRef();
    }

    componentDidMount() {
    }

    onDoubleClick() {
        if(this.isDraggable()) {
            if(this._removeDrag) {
                this._removeDrag();
                delete this._removeDrag;
            }
        } else {
            if(this.handleRef.current) {
                this._removeDrag = xyDrag(this.containerRef.current, this.handleRef.current, { baseOffsetX: 5, baseOffsetY: -50 });
            }
        }
    }

    isDraggable() {
        return !!this._removeDrag;
    }

    render() {
        return (
            <div
                ref={ this.containerRef }
                className={ classNames('panel', `panel-${this.props.type}`, this.props.className) }
                style={ this.props.styles || {} }
            >
                { this.props.title &&
                    <div
                        onDoubleClick={ this.onDoubleClick.bind(this) }
                        ref={ this.handleRef }
                        className={ classNames('panel-heading', this.props.titleClass) }
                        style={ { cursor: 'grab' } }
                    >
                        { this.props.title }
                    </div>
                }
                <div className={ classNames('panel-body', this.props.panelBodyClass) }>
                    { this.props.children }
                </div>
            </div>);
    }
}

Panel.defaultProps = {
    type: 'primary'
};

export default Panel;
