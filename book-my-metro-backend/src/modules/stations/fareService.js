import { pool } from '../../config/database.js';

class FareService {
    // 1. Fetch the network edges from PostgreSQL
    static async getNetworkEdges() {
        // This brilliant SQL query finds every station that is exactly 1 sequence number away on the same line
        const query = `
            SELECT a.station_id AS source, b.station_id AS target
            FROM station_routes a
            JOIN station_routes b ON a.line_id = b.line_id
            WHERE ABS(a.sequence_number - b.sequence_number) = 1;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // 2. Build the Adjacency List for the graph
    static buildAdjacencyList(edges) {
        const graph = new Map();
        
        for (const edge of edges) {
            if (!graph.has(edge.source)) graph.set(edge.source, []);
            if (!graph.has(edge.target)) graph.set(edge.target, []);
            
            graph.get(edge.source).push(edge.target);
            // We don't need to push target->source explicitly because the SQL query 
            // captures both directions natively due to the ABS() function!
        }
        return graph;
    }

    // 3. The Breadth-First Search (BFS) Algorithm
    static findShortestPathLength(graph, startId, targetId) {
        if (startId === targetId) return 0;

        const queue = [{ currentId: startId, hops: 0 }];
        const visited = new Set([startId]);

        while (queue.length > 0) {
            const { currentId, hops } = queue.shift();

            // Get all adjacent stations
            const neighbors = graph.get(currentId) || [];

            for (const neighborId of neighbors) {
                if (neighborId === targetId) {
                    return hops + 1; // Destination found!
                }

                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    queue.push({ currentId: neighborId, hops: hops + 1 });
                }
            }
        }
        
        return -1; // Path not found (Shouldn't happen in a connected metro)
    }

    // 4. The Final Fare Calculation
    static async calculateFare(startStationId, endStationId) {
        try {
            const edges = await this.getNetworkEdges();
            const graph = this.buildAdjacencyList(edges);
            
            const totalHops = this.findShortestPathLength(graph, parseInt(startStationId), parseInt(endStationId));
            
            if (totalHops === -1) {
                throw new Error("No valid route exists between these stations.");
            }

            // Kolkata Metro Fare Logic (Simulated)
            // Base fare is ₹5, plus ₹5 for every 3 stations traveled
            const baseFare = 5;
            const additionalFare = Math.floor(totalHops / 3) * 5;
            const totalFare = baseFare + additionalFare;

            return {
                startStationId,
                endStationId,
                totalStationsTraveled: totalHops,
                fareAmount: totalFare,
                currency: 'INR'
            };

        } catch (error) {
            console.error("Fare Calculation Error:", error);
            throw error;
        }
    }
}

export default FareService;