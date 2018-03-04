import * as p5 from 'p5';
import * as p5dom from 'p5/lib/addons/p5.dom';
import * as p5sound from 'p5/lib/addons/p5.sound';

import {Playground} from './playground';
import {Freeman} from './freeman';
import {BorderFinder, BorderWriter} from './border-worker';
import {DirectionBuilder} from './direction';

declare var p5dom: any;
declare var p5sound: any;

export function setupP5(colCount: number, rowCount: number, spacing: number, showCoordinates: boolean, directionCount: number) {
  const canvasWidth = colCount * spacing + 1;
  const canvasHeight = rowCount * spacing + 1;

  const sketch = function(p: p5) {
    let c: HTMLCanvasElement;
    let playground: Playground;
    let tempPoints: any;
    let freeman = Freeman.empty();

    p.setup = () => {
      console.log('setup');

      p.mouseClicked = () => {
        if (playground.isClickInPlayground()) {
          const point = playground.mouseToPoint();
          playground.togglePoint(point);
        }
      };
      p.mouseMoved = () => {
        if (playground.isClickInPlayground()) {
          const point = playground.mouseToPoint();
          playground.highlight(point);
        } else {
          playground.highlight(null);
        }
      };

      c = p.createCanvas(canvasWidth, canvasHeight);
      c.parent('#drawing-area');
      c.class('my-canvas z-depth-1');

      playground = new Playground(p, colCount, rowCount, spacing, canvasWidth, canvasHeight, showCoordinates);
      playground.prepareGrid();
      if (tempPoints) {
        playground.loadPoints(tempPoints);
        tempPoints = null;
      }
    };
    p.draw = () => {
      p.clear();
      playground.showGrid();
      playground.showPoints();

      freeman.draw(playground.drawer);
    };

    p.clearCanvas = () => {
      playground.clearPlayground();
      freeman = Freeman.empty();
    };
    p.loadGrid = (points: any) => {
      if (!playground) {
        tempPoints = points;
      } else {
        playground.loadPoints(points);
      }
    };
    p.getCanvasStructure = () => {
      return playground.savePoints();
    };

    p.takeScreenshot = () => {
      p.saveCanvas(c, 'canvas', 'png');
    };
    p.findBorders = () => {
      const direction = DirectionBuilder.from(directionCount);
      const borderFinder = new BorderFinder(playground.grid, direction);
      const borderVisualizer = new BorderWriter(borderFinder.computeBorder(), playground.grid, direction);
      borderVisualizer.write();
      freeman = new Freeman(borderFinder.startPoint, borderVisualizer.freeman, direction.directions());
    };
  };
  return new p5(sketch, '#drawing-area');
}
