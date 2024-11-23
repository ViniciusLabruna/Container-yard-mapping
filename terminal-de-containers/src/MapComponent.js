import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './MapComponent.css'; // Adicionamos um arquivo CSS separado para estilos

const MapComponent = ({ containers }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Limpa o SVG para re-renderizar

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const groupedData = d3.group(containers, d => `${d.rua}-${d.quadra}-${d.pilha}`);

    const pilhaPositions = Array.from(groupedData.keys()).map((key, index) => ({
      key,
      x: margin.left + (index % 10) * (width - margin.left - margin.right) / 10,
      y: margin.top + Math.floor(index / 10) * (height - margin.top - margin.bottom) / 10,
    }));

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    const pilhas = svg.selectAll('.pilha')
      .data(pilhaPositions)
      .enter().append('g')
      .attr('class', 'pilha')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('mouseover', function (event, d) {
        d3.select(this).select('rect').attr('stroke', 'black');
        d3.select(this).select('text').style('display', 'block');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).select('rect').attr('stroke', 'none');
        d3.select(this).select('text').style('display', 'none');
      });

    pilhas.append('rect')
      .attr('width', 50)
      .attr('height', 50)
      .attr('fill', d => colorScale(d.key));

    pilhas.append('text')
      .attr('x', 25)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .text(d => groupedData.get(d.key).map(container => container.container_number).join(', '))
      .style('display', 'none');
  }, [containers]);

  return (
    <div>
      <h2>Visualização do Pátio</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default MapComponent;
