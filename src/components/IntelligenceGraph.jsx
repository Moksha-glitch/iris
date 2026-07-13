import React, { useRef, useEffect } from 'react';
import { decisions, connections } from '../store';

const colors = {
  g: '#166534',
  a: '#B45309',
  r: '#B91C1C',
  gBg: 'rgba(22, 101, 52, 0.1)',
  aBg: 'rgba(180, 83, 9, 0.1)',
  rBg: 'rgba(185, 28, 28, 0.1)',
  grid: 'rgba(0, 0, 0, 0.05)',
  text: '#71717A',
  textHigh: '#18181B',
  nodeBg: '#FFFFFF'
};

export default function IntelligenceGraph({ activeNodeId, onNodeClick }) {
  const canvasRef = useRef(null);
  const hoveredNodeIdRef = useRef(null);
  const animationRef = useRef(null);
  
  // Camera & Interaction State
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const isDraggingBgRef = useRef(false);
  const draggedNodeIdRef = useRef(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;

    // Initialize nodes only once so their positions persist during dragging
    if (Object.keys(nodesRef.current).length === 0) {
      width = window.innerWidth - 64; 
      height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      
      decisions.forEach((d, i) => {
        const angle = (i / decisions.length) * Math.PI * 2 - Math.PI / 2;
        const radiusMultiplier = (i % 3 === 0) ? 1.5 : (i % 2 === 0 ? 1 : 2);
        const radius = 150 * radiusMultiplier; 
        
        nodesRef.current[d.id] = {
          ...d,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          baseRadius: 24
        };
      });
      // Start camera centered
      cameraRef.current = { x: 0, y: 0, zoom: 1 };
    }

    const resize = () => {
      width = window.innerWidth - 64; 
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      const time = Date.now();
      const camera = cameraRef.current;
      const nodes = nodesRef.current;

      ctx.clearRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.zoom, camera.zoom);
      
      // Infinite Grid
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      // Calculate visible bounds in world coordinates
      const startX = -camera.x / camera.zoom;
      const endX = startX + width / camera.zoom;
      const startY = -camera.y / camera.zoom;
      const endY = startY + height / camera.zoom;
      
      const gridStartX = Math.floor(startX / gridSize) * gridSize;
      const gridStartY = Math.floor(startY / gridSize) * gridSize;

      ctx.beginPath();
      for(let x = gridStartX; x < endX; x += gridSize) {
        ctx.moveTo(x, startY); ctx.lineTo(x, endY);
      }
      for(let y = gridStartY; y < endY; y += gridSize) {
        ctx.moveTo(startX, y); ctx.lineTo(endX, y);
      }
      ctx.stroke();
      
      // Connections
      ctx.lineWidth = 1.5;
      connections.forEach(conn => {
        const s = nodes[conn.source];
        const t = nodes[conn.target];
        if (s && t) {
          const isFaded = activeNodeId && activeNodeId !== conn.source && activeNodeId !== conn.target;
          const isHoverFaded = hoveredNodeIdRef.current && hoveredNodeIdRef.current !== conn.source && hoveredNodeIdRef.current !== conn.target;
          
          ctx.strokeStyle = (isFaded || isHoverFaded) ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
      });
      
      // Nodes
      for (let id in nodes) {
        const n = nodes[id];
        const isActive = activeNodeId === id;
        const isHovered = hoveredNodeIdRef.current === id;
        const isUnfocused = (activeNodeId || hoveredNodeIdRef.current) && !isActive && !isHovered;
        
        const baseColor = colors[n.rag] || '#71717A';
        const bgColor = colors[`${n.rag}Bg`] || 'rgba(113, 113, 122, 0.1)';
        
        ctx.save();
        if (isUnfocused) ctx.globalAlpha = 0.3;
        
        // Impact Ring & Pulse Animation
        let impactScale = n.confidence < 80 ? 1.4 : 1.1;
        
        // Pulse for critical/red nodes
        if (n.rag === 'r') {
          const pulse = Math.sin(time / 200) * 0.1; // Pulsing effect
          impactScale += pulse;
          ctx.globalAlpha = isUnfocused ? 0.3 : 0.8 + (Math.sin(time / 200) * 0.2);
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.baseRadius * impactScale, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = (isActive || isHovered) ? 3 : 1;
        ctx.stroke();
        
        // Core Node
        if (n.rag === 'r') ctx.globalAlpha = isUnfocused ? 0.3 : 1.0; // reset alpha for core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.nodeBg;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = baseColor;
        ctx.stroke();
        
        // Inner Confidence Fill
        const confAngle = (n.confidence / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.arc(n.x, n.y, n.baseRadius - 2, -Math.PI/2, confAngle - Math.PI/2);
        ctx.fillStyle = bgColor;
        ctx.fill();

        // Label
        ctx.fillStyle = (isActive || isHovered) ? colors.textHigh : colors.text;
        ctx.font = (isActive || isHovered) ? '600 12px Inter' : '500 11px Inter';
        ctx.textAlign = 'center';
        
        // Draw text with a subtle white halo for readability over grid/lines
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(n.title, n.x, n.y + n.baseRadius * 1.8 + 5);
        ctx.shadowBlur = 0; // reset

        ctx.restore();
      }

      ctx.restore(); // Restore camera transform

      // Animation Loop
      animationRef.current = requestAnimationFrame(draw);
    };

    // Helper: Convert screen coords to world coords
    const toWorldCoords = (screenX, screenY) => {
      return {
        x: (screenX - cameraRef.current.x) / cameraRef.current.zoom,
        y: (screenY - cameraRef.current.y) / cameraRef.current.zoom
      };
    };

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const world = toWorldCoords(mouseX, mouseY);
      
      lastMouseRef.current = { x: mouseX, y: mouseY };

      let foundId = null;
      for (let id in nodesRef.current) {
        const n = nodesRef.current[id];
        const dist = Math.hypot(n.x - world.x, n.y - world.y);
        if (dist < n.baseRadius * 1.5) {
          foundId = id;
          break;
        }
      }

      if (foundId) {
        draggedNodeIdRef.current = foundId;
      } else {
        isDraggingBgRef.current = true;
        canvas.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const dx = mouseX - lastMouseRef.current.x;
      const dy = mouseY - lastMouseRef.current.y;
      
      const world = toWorldCoords(mouseX, mouseY);

      if (draggedNodeIdRef.current) {
        // Drag node
        const n = nodesRef.current[draggedNodeIdRef.current];
        n.x += dx / cameraRef.current.zoom;
        n.y += dy / cameraRef.current.zoom;
        canvas.style.cursor = 'grabbing';
      } else if (isDraggingBgRef.current) {
        // Pan camera
        cameraRef.current.x += dx;
        cameraRef.current.y += dy;
      } else {
        // Hover detection
        let foundId = null;
        for (let id in nodesRef.current) {
          const n = nodesRef.current[id];
          const dist = Math.hypot(n.x - world.x, n.y - world.y);
          if (dist < n.baseRadius * 1.5) {
            foundId = id;
            break;
          }
        }
        
        if (foundId !== hoveredNodeIdRef.current) {
          hoveredNodeIdRef.current = foundId;
          canvas.style.cursor = foundId ? 'grab' : 'default';
        }
      }

      lastMouseRef.current = { x: mouseX, y: mouseY };
    };

    const handleMouseUp = (e) => {
      isDraggingBgRef.current = false;
      draggedNodeIdRef.current = null;
      canvas.style.cursor = hoveredNodeIdRef.current ? 'grab' : 'default';
    };

    const handleClick = (e) => {
      if (hoveredNodeIdRef.current) {
        onNodeClick(hoveredNodeIdRef.current);
      } else {
        onNodeClick(null);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomSensitivity = 0.001;
      const zoomDelta = -e.deltaY * zoomSensitivity;
      
      let newZoom = cameraRef.current.zoom * Math.exp(zoomDelta);
      newZoom = Math.max(0.3, Math.min(newZoom, 3)); // Clamp zoom

      // Zoom towards mouse position
      const worldBefore = toWorldCoords(mouseX, mouseY);
      cameraRef.current.zoom = newZoom;
      const worldAfter = toWorldCoords(mouseX, mouseY);

      cameraRef.current.x += (worldAfter.x - worldBefore.x) * newZoom;
      cameraRef.current.y += (worldAfter.y - worldBefore.y) * newZoom;
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    resize();
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('wheel', handleWheel);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeNodeId, onNodeClick]);

  return (
    <div id="graph-container">
      <canvas ref={canvasRef} id="graph-canvas"></canvas>
    </div>
  );
}
