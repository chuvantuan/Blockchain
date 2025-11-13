import React, { useRef } from 'react';
import CrackDemo from './CrackDemo';
import HistoryTable, { HistoryTableRef } from './HistoryTable';

const AdminPage: React.FC = () => {
    const historyTableRef = useRef<HistoryTableRef>(null);

    const handleNewResult = () => {
        // When a new demo is run, refresh the history table
        historyTableRef.current?.refresh();
    };

    return (
        <div className="container mt-4">
            <header className="mb-4">
                <h1>Admin Security Panel</h1>
                <p className="lead">Tools for analyzing and demonstrating security features.</p>
            </header>
            
            <main>
                <CrackDemo onNewResult={handleNewResult} />
                <HistoryTable ref={historyTableRef} />
            </main>
        </div>
    );
};

export default AdminPage;
