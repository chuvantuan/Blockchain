import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getCrackDemoHistory, CrackDemoHistory } from '../../services/adminService';
import { format } from 'date-fns';

export interface HistoryTableRef {
    refresh: () => void;
}

const HistoryTable = forwardRef<HistoryTableRef>((props, ref) => {
    const [history, setHistory] = useState<CrackDemoHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCrackDemoHistory();
            // Sort by most recent first
            setHistory(data.sort((a, b) => new Date(b.testTimestamp).getTime() - new Date(a.testTimestamp).getTime()));
        } catch (err: any) {
            setError(err.message || 'Could not fetch history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Expose a refresh function to the parent component
    useImperativeHandle(ref, () => ({
        refresh() {
            fetchHistory();
        }
    }));

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h3 className="card-title mb-3">Test History</h3>
                <div className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead className="table-light">
                            <tr>
                                <th>Timestamp</th>
                                <th>Password</th>
                                <th>Algorithm</th>
                                <th>Status</th>
                                <th>Time (ms)</th>
                                <th>Attempts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <tr key={item.id}>
                                        <td>{format(new Date(item.testTimestamp), 'yyyy-MM-dd HH:mm:ss')}</td>
                                        <td>{item.originalPassword}</td>
                                        <td>{item.algorithm}</td>
                                        <td>
                                            {item.cracked ? (
                                                <span className="badge bg-danger">Cracked</span>
                                            ) : (
                                                <span className="badge bg-success">Secure</span>
                                            )}
                                        </td>
                                        <td>{item.timeTakenMs}</td>
                                        <td>{item.attempts.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">No history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

HistoryTable.displayName = 'HistoryTable';
export default HistoryTable;
