'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  ShieldCheck, 
  User, 
  Shield,
  Lock,
  AlertCircle,
  Archive,
  CheckCircle,
  Edit,
  Activity,
  Globe
} from 'lucide-react';

// Styles for the "Flora" inspired look
const nodeBaseStyle = "bg-white shadow-xl rounded-2xl border-0 p-4 text-sm font-medium text-slate-800 hover:shadow-2xl transition-shadow duration-300";
const headerBaseStyle = "border-none bg-transparent w-[300px] text-center pointer-events-none";

// Define initial nodes
const initialNodes: Node[] = [
  // --- SWIMLANE HEADERS ---
  {
    id: 'header-user',
    type: 'input',
    data: { 
      label: (
        <div className="flex flex-col items-center opacity-90">
          <div className="bg-blue-600 text-white p-3 rounded-full mb-2 shadow-lg shadow-blue-200">
            <User size={24} />
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">End User Flow</div>
          <div className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">Creation & Usage</div>
        </div>
      ) 
    },
    position: { x: 0, y: -80 },
    className: headerBaseStyle,
    draggable: false,
    connectable: false,
  },
  {
    id: 'header-admin',
    type: 'input',
    data: { 
      label: (
        <div className="flex flex-col items-center opacity-90">
          <div className="bg-purple-600 text-white p-3 rounded-full mb-2 shadow-lg shadow-purple-200">
            <Shield size={24} />
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Flow</div>
          <div className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">Governance & Review</div>
        </div>
      ) 
    },
    position: { x: 600, y: -80 },
    className: headerBaseStyle,
    draggable: false,
    connectable: false,
  },

  // --- END USER: CREATE ---
  {
    id: 'u-start',
    type: 'input',
    data: { 
      label: (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Activity size={16} /></div>
          <div className="text-center">
            <div className="font-bold text-base">Trigger</div>
            <div className="text-xs text-slate-500 mt-1">Need new Voice/Audience</div>
          </div>
        </div>
      ) 
    },
    position: { x: 50, y: 80 },
    className: `${nodeBaseStyle} w-[200px]`,
  },
  {
    id: 'u-create',
    data: { label: 'Click "Create Brand Voice"' },
    position: { x: 50, y: 230 },
    className: `${nodeBaseStyle} w-[200px] border-l-4 border-blue-500`,
  },
  {
    id: 'u-fill',
    data: { 
      label: (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-900">Fill Details</span>
          <span className="text-xs text-slate-500">Name, Description, Examples</span>
        </div>
      ) 
    },
    position: { x: 50, y: 380 },
    className: `${nodeBaseStyle} w-[200px] border-l-4 border-blue-400`,
  },

  // --- DECISION: VISIBILITY ---
  {
    id: 'u-visibility',
    type: 'default',
    data: { label: <div className="font-bold text-blue-900">Visibility?</div> },
    position: { x: 100, y: 530 }, 
    className: "w-[100px] h-[100px] bg-white rounded-full shadow-xl border-4 border-blue-100 flex items-center justify-center z-10",
  },

  // --- PATH A: PRIVATE ---
  {
    id: 's-private',
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Lock size={18}/></div>
          <div className="text-left leading-tight">
            <div className="font-bold text-slate-700">Private</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Personal Use</div>
          </div>
        </div>
      ) 
    },
    position: { x: -150, y: 680 }, 
    className: `${nodeBaseStyle} w-[200px] border-l-4 border-slate-400 bg-slate-50`,
  },

  // --- PATH B: PUBLIC (Needs Review) ---
  {
    id: 's-save',
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Globe size={18}/></div>
          <div className="text-left leading-tight">
            <div className="font-bold text-slate-700">Public</div>
            <div className="text-[10px] text-blue-600 uppercase tracking-wider font-bold">Unverified</div>
          </div>
        </div>
      ) 
    },
    position: { x: 250, y: 680 },
    className: `${nodeBaseStyle} w-[200px] border-dashed border-2 border-blue-300 bg-white`,
  },

  // --- ADMIN: REVIEW ---
  {
    id: 'a-dashboard',
    data: { 
      label: (
        <div className="flex flex-col gap-2">
          <div className="font-bold flex items-center gap-2 text-purple-900">
            <Shield size={16} className="fill-current opacity-20 text-purple-600"/> 
            Admin Dashboard
          </div>
          <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md self-start font-semibold">
            &quot;Needs Review&quot; Queue
          </div>
        </div>
      ) 
    },
    position: { x: 650, y: 680 },
    className: `${nodeBaseStyle} w-[220px] border-l-4 border-purple-500`,
  },
  {
    id: 'a-review',
    data: { 
      label: (
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Action</div>
          Review Detail
        </div>
      ) 
    },
    position: { x: 650, y: 830 },
    className: `${nodeBaseStyle} w-[220px]`,
  },
  
  // --- DECISION POINT ---
  {
    id: 'a-decision',
    type: 'default', 
    data: { label: <div className="font-bold text-purple-900">Decision</div> },
    position: { x: 710, y: 950 },
    className: "w-[100px] h-[100px] bg-white rounded-full shadow-xl border-4 border-purple-100 flex items-center justify-center z-10",
  },

  // --- OUTCOMES ---
  // 1. Verify & Lock
  {
    id: 'o-verify-lock',
    data: { label: <div className="flex items-center gap-2 font-bold text-green-700"><Lock size={14}/> Verify & Lock</div> },
    position: { x: 380, y: 1100 },
    className: "bg-white border-green-200 border text-sm rounded-full px-4 py-2 shadow-sm w-[150px] flex justify-center",
  },
  {
    id: 's-official',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="bg-green-100 p-2 rounded-full text-green-600 mb-2"><ShieldCheck size={24}/></div>
          <span className="font-extrabold text-green-900">OFFICIAL IQ</span>
          <span className="text-xs text-green-600 font-medium">Verified + Locked</span>
        </div>
      ) 
    },
    position: { x: 380, y: 1200 },
    className: `${nodeBaseStyle} w-[160px] ring-2 ring-green-500 ring-offset-2`,
  },

  // 2. Request Changes
  {
    id: 'o-request',
    data: { label: <div className="flex items-center gap-2 font-bold text-amber-700"><Edit size={14}/> Request Changes</div> },
    position: { x: 685, y: 1100 },
    className: "bg-white border-amber-200 border text-sm rounded-full px-4 py-2 shadow-sm w-[160px] flex justify-center",
  },
  {
    id: 's-changes',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="bg-amber-100 p-2 rounded-full text-amber-600 mb-2"><AlertCircle size={24}/></div>
          <span className="font-bold text-amber-900">Unverified</span>
          <span className="text-xs text-amber-600 font-medium">Changes Requested</span>
        </div>
      ) 
    },
    position: { x: 685, y: 1200 },
    className: `${nodeBaseStyle} w-[160px] border-dashed border-2 border-amber-300`,
  },

  // 3. Archive
  {
    id: 'o-archive',
    data: { label: <div className="flex items-center gap-2 font-bold text-red-700"><Archive size={14}/> Archive</div> },
    position: { x: 900, y: 1100 },
    className: "bg-white border-red-200 border text-sm rounded-full px-4 py-2 shadow-sm w-[150px] flex justify-center",
  },
  {
    id: 's-archived',
    data: { 
      label: (
        <div className="flex items-center gap-2 opacity-50">
          <Archive size={16}/> <span>Archived</span>
        </div>
      ) 
    },
    position: { x: 900, y: 1200 },
    className: `${nodeBaseStyle} w-[150px] bg-slate-100 text-slate-400`,
  },

  // --- USER: USAGE ---
  {
    id: 'u-picker',
    data: { 
      label: (
        <div className="flex flex-col gap-2">
           <div className="font-bold text-blue-900 flex items-center gap-2">
             <User size={16} /> Canvas / Grid
           </div>
           <div className="text-xs text-slate-500">
             User selects voice while creating content
           </div>
        </div>
      ) 
    },
    position: { x: 50, y: 1400 },
    className: `${nodeBaseStyle} w-[200px] border-l-4 border-blue-600`,
  },
  {
    id: 'u-see-official',
    data: { label: <div className="flex items-center gap-2 font-bold text-green-700"><CheckCircle size={16} className="fill-green-100"/> Recommended</div> },
    position: { x: 380, y: 1410 },
    className: "bg-white shadow-sm rounded-lg px-3 py-2 border border-green-100 w-[160px]",
  },
  {
    id: 'u-see-workspace',
    data: { label: <div className="text-slate-500 text-sm">Private Voices</div> },
    position: { x: 685, y: 1410 }, 
    className: "bg-slate-50 shadow-none rounded-lg px-3 py-2 border border-slate-200 w-[160px]",
  },
];

const edgeStyle = { stroke: '#94a3b8', strokeWidth: 2 };
const edgeAnimatedStyle = { stroke: '#6366f1', strokeWidth: 2 };

// Define edges
const initialEdges: Edge[] = [
  { id: 'e1', source: 'u-start', target: 'u-create', type: 'smoothstep', style: edgeStyle },
  { id: 'e2', source: 'u-create', target: 'u-fill', type: 'smoothstep', style: edgeStyle },
  
  // New Decision Edges
  { id: 'e3-decision', source: 'u-fill', target: 'u-visibility', type: 'smoothstep', style: edgeStyle },
  { id: 'e3-private', source: 'u-visibility', target: 's-private', label: 'Private', type: 'smoothstep', style: edgeStyle },
  { id: 'e3-public', source: 'u-visibility', target: 's-save', label: 'Public', type: 'smoothstep', style: edgeStyle },

  // Cross-lane connection (Only from Public/Save)
  { id: 'e4', source: 's-save', target: 'a-dashboard', type: 'bezier', animated: true, label: 'Appears in Queue', style: edgeAnimatedStyle },
  
  { id: 'e5', source: 'a-dashboard', target: 'a-review', type: 'smoothstep', style: edgeStyle },
  { id: 'e6', source: 'a-review', target: 'a-decision', type: 'smoothstep', style: edgeStyle },

  // Decisions
  { id: 'e7', source: 'a-decision', target: 'o-verify-lock', type: 'smoothstep', style: { stroke: '#22c55e', strokeWidth: 2 } },
  { id: 'e8', source: 'o-verify-lock', target: 's-official', type: 'smoothstep', style: { stroke: '#22c55e', strokeWidth: 2 } },

  { id: 'e9', source: 'a-decision', target: 'o-request', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e10', source: 'o-request', target: 's-changes', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  // Loop back
  { id: 'e11', source: 's-changes', target: 'u-fill', type: 'bezier', label: 'User Edits', animated: true, style: { stroke: '#f59e0b', strokeDasharray: '5 5' }, sourceHandle: 'bottom' },

  { id: 'e12', source: 'a-decision', target: 'o-archive', type: 'smoothstep', style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e13', source: 'o-archive', target: 's-archived', type: 'smoothstep', style: { stroke: '#ef4444', strokeWidth: 2 } },

  // Usage connections
  { id: 'e14', source: 's-official', target: 'u-see-official', type: 'bezier', animated: true, style: { stroke: '#22c55e' } },
  { id: 'e15', source: 'u-picker', target: 'u-see-official', type: 'smoothstep', style: { strokeDasharray: '5 5', stroke: '#22c55e' } },
  
  { id: 'e16', source: 's-save', target: 'u-see-workspace', type: 'bezier', animated: true, sourceHandle: 'right', style: { stroke: '#94a3b8' } },
  { id: 'e17', source: 's-changes', target: 'u-see-workspace', type: 'bezier', animated: true, style: { stroke: '#94a3b8' } },
  
  // Private connection to workspace
  { id: 'e19', source: 's-private', target: 'u-see-workspace', type: 'bezier', animated: true, style: { stroke: '#94a3b8', strokeDasharray: '5 5' } },
];

export default function GovernanceFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <ReactFlowProvider>
      <div className="w-full h-[800px] bg-slate-50/50 border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls className="bg-white shadow-xl border-0 rounded-lg overflow-hidden" />
          <MiniMap 
            zoomable 
            pannable 
            className="bg-white shadow-xl rounded-lg overflow-hidden border-0"
            nodeStrokeColor="#e2e8f0"
            nodeColor="#f8fafc"
            maskColor="rgba(240, 242, 245, 0.7)"
          />
          <Background color="#cbd5e1" gap={24} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
