import { useState, useEffect } from "react";
import {
    fetchHoneymoonConfig, updateHoneymoonConfig,
    fetchHimalayanConfig, updateHimalayanConfig,
    fetchInternationalConfig, updateInternationalConfig,
    fetchIndiaConfig, updateIndiaConfig,
    fetchBackpackingConfig, updateBackpackingConfig,
    fetchSummerConfig, updateSummerConfig,
    fetchMonsoonConfig, updateMonsoonConfig
} from "../services/api";
import styles from "./SectionSettings.module.css";

const SectionCard = ({ title, config, onUpdate, loading }) => {
    const [localConfig, setLocalConfig] = useState(config);

    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    if (!localConfig) return <div className={styles.skeletonCard} />;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalConfig(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSave = () => {
        onUpdate(localConfig);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>{title}</h4>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        name="is_enabled"
                        checked={localConfig.is_enabled}
                        onChange={handleChange}
                    />
                    <span className={styles.slider}></span>
                </label>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.inputGroup}>
                    <label>Section Title</label>
                    <input
                        type="text"
                        name="title"
                        value={localConfig.title}
                        onChange={handleChange}
                        placeholder="e.g. Majestic Himalayas"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Subtitle (Optional)</label>
                    <textarea
                        name="subtitle"
                        value={localConfig.subtitle}
                        onChange={handleChange}
                        placeholder="Smaller text below title..."
                        rows={2}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Scroll Speed (Seconds)</label>
                    <div className={styles.rangeRow}>
                        <input
                            type="range"
                            name="scroll_speed"
                            min="20"
                            max="120"
                            step="5"
                            value={localConfig.scroll_speed}
                            onChange={handleChange}
                        />
                        <span className={styles.rangeValue}>{localConfig.scroll_speed}s</span>
                    </div>
                    <p className={styles.helpText}>Higher = Slower animation</p>
                </div>

                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Update Section"}
                </button>
            </div>
        </div>
    );
};

const SectionSettings = () => {
    const [configs, setConfigs] = useState({
        honeymoon: null,
        himalayan: null,
        international: null,
        india: null,
        backpacking: null,
        summer: null,
        monsoon: null
    });
    const [loading, setLoading] = useState({
        honeymoon: false,
        himalayan: false,
        international: false,
        india: false,
        backpacking: false,
        summer: false,
        monsoon: false
    });
    const [message, setMessage] = useState("");

    const loadConfigs = async () => {
        try {
            const [honeymoon, himalayan, international, india, backpacking, summer, monsoon] = await Promise.all([
                fetchHoneymoonConfig().catch(() => null),
                fetchHimalayanConfig().catch(() => null),
                fetchInternationalConfig().catch(() => null),
                fetchIndiaConfig().catch(() => null),
                fetchBackpackingConfig().catch(() => null),
                fetchSummerConfig().catch(() => null),
                fetchMonsoonConfig().catch(() => null)
            ]);
            setConfigs({ honeymoon, himalayan, international, india, backpacking, summer, monsoon });
        } catch (err) {
            console.error("Failed to load configs", err);
        }
    };

    useEffect(() => {
        loadConfigs();
    }, []);

    const handleUpdate = async (type, data) => {
        setLoading(prev => ({ ...prev, [type]: true }));
        setMessage("");
        try {
            if (type === "honeymoon") await updateHoneymoonConfig(data);
            if (type === "himalayan") await updateHimalayanConfig(data);
            if (type === "international") await updateInternationalConfig(data);
            if (type === "india") await updateIndiaConfig(data);
            if (type === "backpacking") await updateBackpackingConfig(data);
            if (type === "summer") await updateSummerConfig(data);
            if (type === "monsoon") await updateMonsoonConfig(data);
            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} section updated successfully!`);
            loadConfigs();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Showcase Section Settings</h3>
                <p className={styles.subtitle}>Control how different trip categories are showcased on the landing page.</p>
            </div>

            {message && (
                <div className={`${styles.alert} ${message.includes("Error") ? styles.alertError : styles.alertSuccess}`}>
                    {message}
                </div>
            )}

            <div className={styles.grid}>
                <SectionCard
                    title="International Trips"
                    config={configs.international}
                    onUpdate={(data) => handleUpdate("international", data)}
                    loading={loading.international}
                />
                <SectionCard
                    title="India Trips"
                    config={configs.india}
                    onUpdate={(data) => handleUpdate("india", data)}
                    loading={loading.india}
                />
                <SectionCard
                    title="Honeymoon Trips"
                    config={configs.honeymoon}
                    onUpdate={(data) => handleUpdate("honeymoon", data)}
                    loading={loading.honeymoon}
                />
                <SectionCard
                    title="Himalayan Treks"
                    config={configs.himalayan}
                    onUpdate={(data) => handleUpdate("himalayan", data)}
                    loading={loading.himalayan}
                />
                <SectionCard
                    title="Backpacking Trips"
                    config={configs.backpacking}
                    onUpdate={(data) => handleUpdate("backpacking", data)}
                    loading={loading.backpacking}
                />
                <SectionCard
                    title="Summer Treks"
                    config={configs.summer}
                    onUpdate={(data) => handleUpdate("summer", data)}
                    loading={loading.summer}
                />
                <SectionCard
                    title="Monsoon Treks"
                    config={configs.monsoon}
                    onUpdate={(data) => handleUpdate("monsoon", data)}
                    loading={loading.monsoon}
                />
            </div>
        </div>
    );
};

export default SectionSettings;
