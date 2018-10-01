import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  snapDiffManyToMany,
  boundingBox,
  snapWithinDiff,
  snap,
  traceConnection,
  applyDiff,
  applyMultipleDiffs
} from "../snapUtils";
import { getWindowSize } from "../utils";
import * as Selectors from "../selectors";
import {
  updateWindowPositions,
  windowsHaveBeenCentered,
  centerWindowsIfNeeded
} from "../actionCreators";
const abuts = (a, b) => {
  // TODO: This is kinda a hack. They should really be touching, not just within snapping distance.
  // Also, overlapping should not count.
  const wouldMoveTo = snap(a, b);
  return wouldMoveTo.x !== undefined || wouldMoveTo.y !== undefined;
};

class WindowManager extends React.Component {
  componentDidMount() {
    this.props.centerWindowsIfNeeded(this.props.container);
  }

  componentDidUpdate() {
    this.props.centerWindowsIfNeeded(this.props.container);
  }

  movingAndStationaryNodes(key) {
    const windows = this.props.windowsInfo.filter(
      w =>
        this.props.windows[w.key] != null && !this.props.getWindowHidden(w.key)
    );
    const targetNode = windows.find(node => node.key === key);

    let movingSet = new Set([targetNode]);
    // Only the main window brings other windows along.
    if (key === "main") {
      const findAllConnected = traceConnection(abuts);
      movingSet = findAllConnected(windows, targetNode);
    }

    const stationary = windows.filter(w => !movingSet.has(w));
    const moving = Array.from(movingSet);

    return [moving, stationary];
  }

  handleMouseDown = (key, e) => {
    if (!e.target.classList.contains("draggable")) {
      return;
    }
    // Prevent dragging from highlighting text.
    e.preventDefault();

    const [moving, stationary] = this.movingAndStationaryNodes(key);

    const mouseStart = { x: e.clientX, y: e.clientY };
    // Aparently this is crazy across browsers.
    const browserSize = getWindowSize();

    const box = boundingBox(moving);

    const handleMouseMove = ee => {
      const proposedDiff = {
        x: ee.clientX - mouseStart.x,
        y: ee.clientY - mouseStart.y
      };

      const proposedWindows = moving.map(node => ({
        ...node,
        ...applyDiff(node, proposedDiff)
      }));

      const proposedBox = {
        ...box,
        ...applyDiff(box, proposedDiff)
      };

      const snapDiff = snapDiffManyToMany(proposedWindows, stationary);

      const withinDiff = snapWithinDiff(proposedBox, browserSize);

      const finalDiff = applyMultipleDiffs(proposedDiff, snapDiff, withinDiff);

      const windowPositionDiff = moving.reduce((diff, window) => {
        diff[window.key] = applyDiff(window, finalDiff);
        return diff;
      }, {});

      this.props.updateWindowPositions(windowPositionDiff, false);
    };

    const removeListeners = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", removeListeners);
    };

    window.addEventListener("mouseup", removeListeners);
    window.addEventListener("mousemove", handleMouseMove);
  };

  render() {
    const style = {
      position: "absolute",
      top: 0,
      left: 0
    };

    const windows = this.props.windowsInfo.filter(
      w => this.props.windows[w.key]
    );

    return windows.map(w => (
      <div
        key={w.key}
        onMouseDown={e => this.handleMouseDown(w.key, e)}
        style={{ ...style, transform: `translate(${w.x}px, ${w.y}px)` }}
      >
        {this.props.windows[w.key]}
      </div>
    ));
  }
}

WindowManager.propTypes = {
  windows: PropTypes.object.isRequired,
  container: PropTypes.instanceOf(Element).isRequired
};

const mapStateToProps = state => ({
  windowsInfo: Selectors.getWindowsInfo(state),
  getWindowHidden: Selectors.getWindowHidden(state),
  getWindowOpen: Selectors.getWindowOpen(state)
});

const mapDispatchToProps = dispatch => {
  return {
    updateWindowPositions: (positions, centered) =>
      dispatch(updateWindowPositions(positions, centered)),
    windowsHaveBeenCentered: () => dispatch(windowsHaveBeenCentered()),
    centerWindowsIfNeeded: container =>
      dispatch(centerWindowsIfNeeded(container))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WindowManager);