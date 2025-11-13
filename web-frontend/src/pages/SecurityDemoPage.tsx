import React, { useRef } from 'react';
import CrackDemo from './AdminPage/CrackDemo';
import HistoryTable, { HistoryTableRef } from './AdminPage/HistoryTable';

const SecurityDemoPage: React.FC = () => {
    const historyTableRef = useRef<HistoryTableRef>(null);

    const handleNewResult = () => {
        // When a new demo is run, refresh the history table
        historyTableRef.current?.refresh();
    };

    return (
        <div className="container-fluid mt-4">
            <header className="mb-4">
                <h2>Password Security Demonstration</h2>
                <p className="text-muted">
                    This tool demonstrates the difference in cracking resistance between modern and legacy hashing algorithms.
                </p>
            </header>
            
            <main>
                <CrackDemo onNewResult={handleNewResult} />
                <HistoryTable ref={historyTableRef} />
            </main>
        </div>
    );
};

export default SecurityDemoPage;
