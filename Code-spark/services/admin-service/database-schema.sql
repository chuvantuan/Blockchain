
CREATE TABLE IF NOT EXISTS crack_demo_history (
    id BIGSERIAL PRIMARY KEY,
    original_password VARCHAR(255) NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    hash_value TEXT NOT NULL,
    cracked BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken_ms BIGINT NOT NULL,
    attempts BIGINT NOT NULL,
    cracked_password VARCHAR(255),
    test_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- INDEXES
-- =====================================================================

-- Index cho tìm kiếm theo algorithm
CREATE INDEX IF NOT EXISTS idx_crack_demo_algorithm 
ON crack_demo_history(algorithm);

-- Index cho tìm kiếm theo thời gian test
CREATE INDEX IF NOT EXISTS idx_crack_demo_timestamp 
ON crack_demo_history(test_timestamp DESC);

-- Index cho tìm kiếm theo trạng thái cracked
CREATE INDEX IF NOT EXISTS idx_crack_demo_cracked 
ON crack_demo_history(cracked);

-- Composite index cho query phổ biến (algorithm + cracked)
CREATE INDEX IF NOT EXISTS idx_crack_demo_algorithm_cracked 
ON crack_demo_history(algorithm, cracked);

-- =====================================================================
-- COMMENTS
-- =====================================================================

COMMENT ON TABLE crack_demo_history IS 

COMMENT ON COLUMN crack_demo_history.id IS 

COMMENT ON COLUMN crack_demo_history.original_password IS 

COMMENT ON COLUMN crack_demo_history.algorithm IS 

COMMENT ON COLUMN crack_demo_history.hash_value IS 

COMMENT ON COLUMN crack_demo_history.cracked IS 

COMMENT ON COLUMN crack_demo_history.time_taken_ms IS 

COMMENT ON COLUMN crack_demo_history.attempts IS 

COMMENT ON COLUMN crack_demo_history.cracked_password IS 

COMMENT ON COLUMN crack_demo_history.test_timestamp IS 

