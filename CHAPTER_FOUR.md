CHAPTER FOUR: SYSTEM DESIGN AND IMPLEMENTATION
4.1 Objective of Design
The design of the Network Congestion Simulator aims to create an interactive educational and analytical tool that demonstrates network congestion control mechanisms. Specifically, the design seeks to:

Provide real-time visualization of network congestion dynamics across different algorithms.
Create a modular and scalable architecture for simulating various network topologies and traffic patterns.
Implement multiple congestion control algorithms (TCP Reno, RED, AI-Optimized) for comparative analysis.
Deliver an intuitive user interface for both educational and research purposes.
Enable dynamic configuration of network parameters and user traffic patterns.


4.2 System Architecture in Terms of Tiers
The system adopts a four-tier architecture for scalability and maintainability:

Presentation Layer (UI/UX)
Interactive dashboard with real-time visualizations using React components.
Responsive design with Tailwind CSS for cross-platform compatibility.
Real-time updates through WebSocket-like state management.
Application Layer (Business Logic)
Simulation engine implementing congestion control algorithms.
Event-driven architecture for handling network state changes.
Modular design allowing easy addition of new algorithms and metrics.
Data Layer
In-memory state management using React Context API.
Historical metrics storage for trend analysis and visualization.
Event logging system for simulation tracking and debugging.
Integration Layer
Seamless integration between UI components and simulation engine.
API endpoints for potential future extensions (monitoring, logging, etc).



Figure 4.1: Network Congestion Simulator Architecture Diagram


4.3 Choice of Programming Environment
Frontend: Next.js 14, React 18, TypeScript
Styling: Tailwind CSS with custom design system
State Management: React Context API with custom hooks
Charts and Visualizations: Recharts library
Icons: Lucide React
Development Tools: ESLint, TypeScript compiler
Version Control: Git with GitHub integration


4.4 Database Structure
The system uses in-memory data structures optimized for real-time performance. Major entities include:

NetworkNodes: Routers, users, and servers with congestion levels
NetworkUsers: Traffic generators with different traffic types and sending rates
NetworkMetrics: Real-time performance measurements (throughput, latency, packet loss)
EventLogs: System events and notifications for monitoring

Figure 4.2: Entity-Relationship Diagram – ERD


4.5 Data Structure Definitions
NetworkNode Interface

typescript
interface NetworkNode {
  id: string;
  type: 'user' | 'router' | 'server';
  congestionLevel: number; // 0 (none) to 1 (max)
}

NetworkUser Interface

typescript
interface NetworkUser {
  id: string;
  name: string;
  trafficType: 'Video Stream' | 'File Download' | 'VoIP Call';
  sendingRate: number; // in Mbps
}

NetworkMetrics Interface

typescript
interface NetworkMetrics {
  timestamp: number;
  throughput: number; // in Mbps
  packetLoss: number; // percentage
  latency: number; // in ms
}

EventLog Interface

typescript
interface EventLog {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}


4.6 Input and Output Screen Formats
Input Screens
Simulation Controls: Interface for starting, pausing, and resetting simulations with algorithm selection

Figures 4.3 Simulation Controls Interface
User Management: Interface for adding and removing network users with different traffic types

Figures 4.4 User Management Interface

Output Screens
Network Topology Dashboard: Visual representation of network nodes with real-time congestion indicators
Live Metrics Chart: Real-time visualization of throughput, latency, and packet loss
Event Log: Chronological display of system events and warnings
User List: Current active users and their traffic characteristics

Figures 4.5 Network Topology Dashboard / Live Metrics Chart



4.7 Program Algorithm
Simulation Algorithm:

Initialize network nodes and users → Calculate total demand → Apply congestion control algorithm → Update node congestion levels → Calculate network metrics → Generate events if thresholds exceeded → Update visualizations

Congestion Control Algorithms:

TCP Reno Algorithm:
- Monitors network congestion through packet loss detection
- Implements additive increase/multiplicative decrease (AIMD)
- Reduces sending rate by 50% upon congestion detection

RED (Random Early Detection) Algorithm:
- Proactively manages queue lengths before congestion occurs
- Uses probabilistic packet dropping based on average queue size
- Provides early congestion notification to prevent global synchronization

AI-Optimized Algorithm:
- Adaptive congestion control based on network conditions
- Optimized for mixed traffic types (video, download, VoIP)
- Balances throughput and latency based on traffic priorities

Event Generation Algorithm:

Monitor packet loss and latency thresholds → If packet loss > 5%, generate warning event → If packet loss > 10%, generate critical event → Log all events with timestamp and severity level


4.8 Program Flowcharts
4.8.1 Simulation Control Flowchart

Figure 4.6: Simulation Control Flowchart
4.8.2 Congestion Detection and Response Flowchart

Figure 4.7: Congestion Detection and Response Flowchart
4.8.3 Metrics Calculation Flowchart

Figure 4.8: Metrics Calculation Flowchart


4.9 Hardware Requirements
Development Environment: Modern computer with minimum 8GB RAM, dual-core CPU
Client Devices: Any device with modern web browser (Chrome, Firefox, Safari, Edge)
Network: Stable internet connection for development and deployment


4.10 Software Requirements
Operating System: Windows, macOS, or Linux
Runtime Environment: Node.js 18+
Framework: Next.js 14 with React 18
Language: TypeScript 5+
Package Manager: npm or yarn
Browser: Modern browser with JavaScript ES6+ support
Development Tools: Code editor (VS Code recommended)


4.11 Documentation
Documentation for the system includes:

User Guide - Instructions for using the simulation interface
Developer Documentation - Code structure and component architecture
Algorithm Documentation - Detailed explanation of congestion control algorithms
API Documentation - Component interfaces and state management
Installation Guide - Setup instructions for development environment
Performance Guide - Optimization tips and best practices
