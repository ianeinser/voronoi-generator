import { Delaunay } from "d3-delaunay";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const sizeX = window.innerWidth;
const sizeY = window.innerHeight;
const dpr = window.devicePixelRatio;
canvas.width = sizeX * dpr;
canvas.height = sizeY * dpr;
context.scale(dpr, dpr);

const numberOfNFTs = 1000;
const points = [];

for (let i = 0; i < numberOfNFTs; i++) {
  const point = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  };
  points.push(point);
}

function drawCell(cell) {
  context.beginPath();
  context.moveTo(cell[0][0], cell[0][1]);
  for (let j = 1, m = cell.length; j < m; ++j) {
    context.lineTo(cell[j][0], cell[j][1]);
  }
  context.closePath();
}

const delaunay = Delaunay.from(points.map((p) => Object.values(p)));
const voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);
const polygons = voronoi.cellPolygons();

context.strokeStyle = "#040";

const treeLines = [];
let p = 0;
for (const polygon of polygons) {
  const bounds = getPolygonBounds(polygon);
  context.fillStyle = getGradient(bounds);
  drawCell(polygon);
  context.fill();
  context.stroke();
  context.closePath();
  if (Math.random() < 0.75) {
    const otherIndex = p + 1 < polygon.length ? p + 1 : p - 1;
    treeLines.push([polygon[p], polygon[otherIndex]]);
  }
}

const TREE_DISTANCE_VARIATION = 100;
const TREE_DENSITY = 0.1;
const TREE_MAX_SIZE = 5;

function drawTrees() {
  for (let treeLine of treeLines) {
    const startPoint = { x: treeLine[0][0], y: treeLine[0][1] };
    const endPoint = { x: treeLine[1][0], y: treeLine[1][1] };
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const treeCount = Math.sqrt(dx ** 2 + dy ** 2) * TREE_DENSITY;
    for (let point = 0; point < treeCount; point++) {
      context.beginPath();
      context.fillStyle = Math.random() < 0.5 ? "#040" : "#060";
      context.arc(
        startPoint.x +
          point * (dx / treeCount) +
          (-TREE_DISTANCE_VARIATION / 2 +
            Math.random() * TREE_DISTANCE_VARIATION),
        startPoint.y +
          point * (dy / treeCount) +
          (-TREE_DISTANCE_VARIATION / 2 +
            Math.random() * TREE_DISTANCE_VARIATION),
        Math.random() * TREE_MAX_SIZE,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }
}

function getPolygonBounds(polygon) {
  let minX, minY, maxX, maxY;
  for (let point of polygon) {
    minX = Math.min(point[0], minX || Infinity);
    minY = Math.min(point[1], minY || Infinity);
    maxX = Math.max(point[0], maxX || -Infinity);
    maxY = Math.max(point[1], maxY || -Infinity);
  }
  return [minX, minY, maxX, maxY];
}

function getColor() {
  const colors = [`#a4ab1d`, `#715440`, `#258133`, `#258133`, `#D2952a`];
  return colors[Math.floor(Math.random() * colors.length)];
}

function darkenColor(color) {
  const colors = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)];
  const hexNumbers = colors.map((c) =>
    Math.abs(parseInt(c, 16) - 15).toString(16)
  );
  return `#${hexNumbers.map((n) => (n.length < 2 ? `0${n}` : n)).join("")}`;
}

function getGradient(bounds) {
  const gradient = context.createLinearGradient(...bounds);
  const color = getColor();
  const darkerColor = darkenColor(color);

  for (let i = 0; i < 1; i += 0.025) {
    gradient.addColorStop(i, color);
    gradient.addColorStop(i + 0.003, color);
    gradient.addColorStop(i + 0.01, darkerColor);
    gradient.addColorStop(i + 0.02, darkerColor);
    gradient.addColorStop(i + 0.024, color);
  }
  return gradient;
}

//drawTrees();
