import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { incidentService, IncidentResponse } from '../services/incidentService';
import { useErrorDialog } from './useErrorDialog';

export const useIncidentLoader = (
  filterFn?: (incidents: IncidentResponse[]) => IncidentResponse[]
) => {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showError } = useErrorDialog();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await incidentService.getAll();
      const filtered = filterFn ? filterFn(data) : data;
      setIncidents(filtered);
    } catch (error: any) {
      console.error('[useIncidentLoader] Error:', error);
      showError('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  return { incidents, loading, refreshing, loadData, setIncidents };
};
