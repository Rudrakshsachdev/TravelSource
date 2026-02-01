import { useEffect, useState, useMemo } from "react";
import styles from "./AdminContactMessage.module.css";
import { fetchContactMessages } from "../services/api";

const AdminContactMessage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // "all", "unread", "today", "week"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "name"

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchContactMessages();
            setMessages(data);
        } catch (err) {
            console.error("Failed to load messages:", err);
            setError("Failed to load messages. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort messages
    const filteredMessages = useMemo(() => {
        let result = [...messages];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(msg =>
                msg.name.toLowerCase().includes(term) ||
                msg.email.toLowerCase().includes(term) ||
                msg.message.toLowerCase().includes(term) ||
                (msg.phone && msg.phone.toLowerCase().includes(term))
            );
        }

        // Apply time filter
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        if (filter === "today") {
            result = result.filter(msg => new Date(msg.created_at) >= today);
        } else if (filter === "week") {
            result = result.filter(msg => new Date(msg.created_at) >= weekAgo);
        } else if (filter === "unread") {
            // Assuming there's an 'unread' property in messages
            result = result.filter(msg => msg.unread);
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === "oldest") {
                return new Date(a.created_at) - new Date(b.created_at);
            } else if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        return result;
    }, [messages, filter, searchTerm, sortBy]);

    const stats = {
        total: messages.length,
        today: messages.filter(msg => new Date(msg.created_at).toDateString() === new Date().toDateString()).length,
        unread: messages.filter(msg => msg.unread).length,
        week: messages.filter(msg => {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return new Date(msg.created_at) >= weekAgo;
        }).length
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffMs = now - messageDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return messageDate.toLocaleDateString();
    };

    const handleMarkAsRead = (id) => {
        // In a real app, you would have an API call here
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, unread: false } : msg
        ));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            // In a real app, you would have an API call here
            setMessages(prev => prev.filter(msg => msg.id !== id));
            setSelectedMessage(null);
        }
    };

    const handleRefresh = () => {
        loadMessages();
    };

    const handleExportCSV = () => {
        if (messages.length === 0) {
            alert("No messages to export.");
            return;
        }

        // Define CSV headers
        const headers = ["ID", "Name", "Email", "Phone", "Message", "Created At"];

        // Format rows
        const csvRows = [
            headers.join(","),
            ...messages.map(msg => [
                msg.id,
                `"${msg.name.replace(/"/g, '""')}"`,
                `"${msg.email.replace(/"/g, '""')}"`,
                `"${(msg.phone || "").replace(/"/g, '""')}"`,
                `"${msg.message.replace(/"/g, '""')}"`,
                `"${new Date(msg.created_at).toLocaleString()}"`
            ].join(","))
        ];

        // Create blob and download
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `contact_messages_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading && messages.length === 0) {
        return (
            <div className={styles.section}>
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Loading messages...</p>
                        <p className={styles.loadingSubtext}>Fetching from the database</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && messages.length === 0) {
        return (
            <div className={styles.section}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                    </div>
                    <h3 className={styles.errorTitle}>Unable to Load Messages</h3>
                    <p className={styles.errorMessage}>{error}</p>
                    <button
                        className={styles.retryButton}
                        onClick={loadMessages}
                    >
                        <svg className={styles.retryIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className={styles.section}>
            {/* Background Overlay - Matching the design system */}
            <div className={styles.backgroundOverlay}></div>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h4 className={styles.subHeading}>ADMIN PANEL</h4>
                        <h1 className={styles.heading}>
                            Contact Messages
                            <span className={styles.gradientText}> Dashboard</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Manage and respond to customer inquiries
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            className={styles.refreshButton}
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <svg className={styles.refreshIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Refresh
                        </button>

                        <button
                            className={styles.exportButton}
                            onClick={handleExportCSV}
                            disabled={loading || messages.length === 0}
                        >
                            <svg className={styles.exportIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <div className={styles.statTrend}>
                                <span className={styles.trendUp}>↑ 12%</span>
                            </div>
                        </div>
                        <div className={styles.statNumber}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Messages</div>
                        <div className={styles.statSubtext}>All time inquiries</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className={styles.statNumber}>{stats.today}</div>
                        <div className={styles.statLabel}>Today</div>
                        <div className={styles.statSubtext}>New messages today</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className={styles.statNumber}>{stats.unread}</div>
                        <div className={styles.statLabel}>Unread</div>
                        <div className={styles.statSubtext}>Requires attention</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className={styles.statTrend}>
                                <span className={styles.trendUp}>↑ 8%</span>
                            </div>
                        </div>
                        <div className={styles.statNumber}>{stats.week}</div>
                        <div className={styles.statLabel}>This Week</div>
                        <div className={styles.statSubtext}>Last 7 days</div>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className={styles.controlsBar}>
                    <div className={styles.searchContainer}>
                        <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search messages by name, email, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchTerm && (
                            <button
                                className={styles.clearSearch}
                                onClick={() => setSearchTerm("")}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Filter by:</label>
                            <div className={styles.filterButtons}>
                                {[
                                    { id: "all", label: "All Messages" },
                                    { id: "unread", label: "Unread" },
                                    { id: "today", label: "Today" },
                                    { id: "week", label: "This Week" }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        className={`${styles.filterButton} ${filter === option.id ? styles.activeFilter : ''}`}
                                        onClick={() => setFilter(option.id)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sortGroup}>
                            <label className={styles.sortLabel}>Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">By Name (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                {filteredMessages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIllustration}>
                            <svg viewBox="0 0 200 200" fill="none">
                                <path d="M50 100C50 72.4 72.4 50 100 50C127.6 50 150 72.4 150 100C150 127.6 127.6 150 100 150C72.4 150 50 127.6 50 100Z" fill="#E2E8F0" />
                                <path d="M80 85C80 79.5 84.5 75 90 75C95.5 75 100 79.5 100 85C100 90.5 95.5 95 90 95C84.5 95 80 90.5 80 85Z" fill="#94A3B8" />
                                <path d="M110 85C110 79.5 114.5 75 120 75C125.5 75 130 79.5 130 85C130 90.5 125.5 95 120 95C114.5 95 110 90.5 110 85Z" fill="#94A3B8" />
                                <path d="M85 110C85 108.9 85.9 108 87 108H113C114.1 108 115 108.9 115 110C115 111.1 114.1 112 113 112H87C85.9 112 85 111.1 85 110Z" fill="#64748B" />
                            </svg>
                        </div>
                        <h3 className={styles.emptyTitle}>No messages found</h3>
                        <p className={styles.emptyText}>
                            {searchTerm ? `No messages match "${searchTerm}"` : "No contact messages yet"}
                        </p>
                        {searchTerm && (
                            <button
                                className={styles.clearFiltersButton}
                                onClick={() => setSearchTerm("")}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.messagesGrid}>
                        {/* Message List Sidebar */}
                        <div className={styles.messagesList}>
                            <div className={styles.listHeader}>
                                <h3 className={styles.listTitle}>
                                    Messages ({filteredMessages.length})
                                    {loading && <span className={styles.loadingBadge}>Updating...</span>}
                                </h3>
                            </div>

                            <div className={styles.listContent}>
                                {filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.listItem} ${selectedMessage?.id === msg.id ? styles.selectedItem : ''} ${msg.unread ? styles.unreadItem : ''}`}
                                        onClick={() => setSelectedMessage(msg)}
                                    >
                                        <div className={styles.itemAvatar}>
                                            <div className={styles.avatarText}>
                                                {msg.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            {msg.unread && <div className={styles.unreadBadge}></div>}
                                        </div>

                                        <div className={styles.itemContent}>
                                            <div className={styles.itemHeader}>
                                                <h4 className={styles.itemName}>{msg.name}</h4>
                                                <span className={styles.itemTime}>{getTimeAgo(msg.created_at)}</span>
                                            </div>
                                            <p className={styles.itemEmail}>{msg.email}</p>
                                            <p className={styles.itemPreview}>
                                                {msg.message.length > 60 ? `${msg.message.substring(0, 60)}...` : msg.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Message Detail View */}
                        <div className={styles.messageDetail}>
                            {selectedMessage ? (
                                <div className={styles.detailCard}>
                                    <div className={styles.detailHeader}>
                                        <div className={styles.detailAvatar}>
                                            <div className={styles.avatarTextLarge}>
                                                {selectedMessage.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                        </div>

                                        <div className={styles.detailSender}>
                                            <h3 className={styles.detailName}>
                                                {selectedMessage.name}
                                                {selectedMessage.unread && (
                                                    <span className={styles.unreadTag}>Unread</span>
                                                )}
                                            </h3>
                                            <div className={styles.detailContact}>
                                                <a href={`mailto:${selectedMessage.email}`} className={styles.detailEmail}>
                                                    <svg className={styles.contactIcon} viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                    {selectedMessage.email}
                                                </a>
                                                {selectedMessage.phone && (
                                                    <a href={`tel:${selectedMessage.phone}`} className={styles.detailPhone}>
                                                        <svg className={styles.contactIcon} viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                        </svg>
                                                        {selectedMessage.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.detailActions}>
                                            <button
                                                className={`${styles.actionButton} ${selectedMessage.unread ? styles.markReadButton : styles.markUnreadButton}`}
                                                onClick={() => handleMarkAsRead(selectedMessage.id)}
                                            >
                                                <svg className={styles.actionIcon} viewBox="0 0 20 20" fill="currentColor">
                                                    {selectedMessage.unread ? (
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    ) : (
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    )}
                                                </svg>
                                                {selectedMessage.unread ? "Mark as Read" : "Mark as Unread"}
                                            </button>

                                            <a
                                                href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry to Travel Professor`}
                                                className={styles.replyButton}
                                            >
                                                <svg className={styles.actionIcon} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Reply
                                            </a>

                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(selectedMessage.id)}
                                            >
                                                <svg className={styles.actionIcon} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.detailMeta}>
                                        <div className={styles.metaItem}>
                                            <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />
                                            </svg>
                                            <span>ID: {selectedMessage.id}</span>
                                        </div>
                                    </div>

                                    <div className={styles.detailMessage}>
                                        <h4 className={styles.messageTitle}>Message:</h4>
                                        <div className={styles.messageContent}>
                                            {selectedMessage.message}
                                        </div>
                                    </div>

                                    <div className={styles.detailTags}>
                                        <span className={styles.tag}>Contact Form</span>
                                        <span className={styles.tag}>Customer Inquiry</span>
                                        {selectedMessage.phone && <span className={styles.tag}>Phone Provided</span>}
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.selectPrompt}>
                                    <div className={styles.promptIllustration}>
                                        <svg viewBox="0 0 200 200" fill="none">
                                            <path d="M50 100C50 72.4 72.4 50 100 50C127.6 50 150 72.4 150 100C150 127.6 127.6 150 100 150C72.4 150 50 127.6 50 100Z" fill="#F1F5F9" />
                                            <path d="M80 85C80 79.5 84.5 75 90 75C95.5 75 100 79.5 100 85C100 90.5 95.5 95 90 95C84.5 95 80 90.5 80 85Z" fill="#CBD5E1" />
                                            <path d="M110 85C110 79.5 114.5 75 120 75C125.5 75 130 79.5 130 85C130 90.5 125.5 95 120 95C114.5 95 110 90.5 110 85Z" fill="#CBD5E1" />
                                            <path d="M90 110C90 108.9 90.9 108 92 108H108C109.1 108 110 108.9 110 110C110 111.1 109.1 112 108 112H92C90.9 112 90 111.1 90 110Z" fill="#94A3B8" />
                                        </svg>
                                    </div>
                                    <h3 className={styles.promptTitle}>Select a message</h3>
                                    <p className={styles.promptText}>
                                        Choose a message from the list to view its details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.footerStats}>
                        <div className={styles.footerStat}>
                            <span className={styles.footerLabel}>Showing:</span>
                            <span className={styles.footerValue}>{filteredMessages.length} of {messages.length}</span>
                        </div>
                        <div className={styles.footerStat}>
                            <span className={styles.footerLabel}>Last updated:</span>
                            <span className={styles.footerValue}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className={styles.footerActions}>
                        <button
                            className={styles.bulkActionButton}
                            onClick={() => {
                                const unreadIds = filteredMessages.filter(m => m.unread).map(m => m.id);
                                if (unreadIds.length > 0) {
                                    // In a real app, you would mark all as read
                                    setMessages(prev => prev.map(msg =>
                                        unreadIds.includes(msg.id) ? { ...msg, unread: false } : msg
                                    ));
                                }
                            }}
                        >
                            <svg className={styles.bulkIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Mark All as Read
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminContactMessage;