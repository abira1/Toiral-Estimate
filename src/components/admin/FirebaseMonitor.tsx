import React, { useState, useEffect } from 'react';
import { DatabaseIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, RefreshCwIcon } from 'lucide-react';
import { 
  getFirebaseUsageStats, 
  checkFirebaseHealth, 
  FirebaseUsageStats, 
  UsageAlert 
} from '../../services/firebaseMonitoring';

export function FirebaseMonitor() {
  const [stats, setStats] = useState<FirebaseUsageStats | null>(null);
  const [alerts, setAlerts] = useState<UsageAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFirebaseData = async () => {
    try {
      const [usageStats, healthAlerts] = await Promise.all([
        getFirebaseUsageStats(),
        checkFirebaseHealth()
      ]);
      
      setStats(usageStats);
      setAlerts(healthAlerts);
    } catch (error) {
      console.error('Error loading Firebase data:', error);
      setAlerts([{
        type: 'error',
        message: 'Failed to load Firebase monitoring data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFirebaseData();
  };

  useEffect(() => {
    loadFirebaseData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadFirebaseData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangleIcon size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangleIcon size={16} className="text-yellow-500" />;
      case 'info':
        return <InfoIcon size={16} className="text-blue-500" />;
      default:
        return <CheckCircleIcon size={16} className="text-green-500" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DatabaseIcon size={20} className="text-primary-600" />
          <h3 className="text-lg font-medium text-gray-800">Firebase Monitoring</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
          <span className="ml-2 text-gray-600">Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DatabaseIcon size={20} className="text-primary-600" />
          <h3 className="text-lg font-medium text-gray-800">Firebase Monitoring</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCwIcon size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Usage Statistics */}
      {stats && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Database Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{stats.quotations}</div>
              <div className="text-sm text-gray-600">Quotations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{stats.services}</div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accessCodes}</div>
              <div className="text-sm text-gray-600">Access Codes</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Data Size</span>
              <span className="text-sm font-bold text-gray-800">{stats.totalDataSize} MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  stats.totalDataSize > 800 ? 'bg-red-500' : 
                  stats.totalDataSize > 500 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((stats.totalDataSize / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Free tier limit: 1000 MB
            </div>
          </div>
        </div>
      )}

      {/* Health Alerts */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">System Health</h4>
        
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-xl p-3">
            <CheckCircleIcon size={16} />
            <span className="text-sm font-medium">All systems operational</span>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className={`border rounded-xl p-3 ${getAlertBgColor(alert.type)}`}>
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{alert.message}</div>
                    {alert.details && (
                      <div className="text-xs mt-1 opacity-75">{alert.details}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {stats && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}