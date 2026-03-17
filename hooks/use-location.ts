"use client";

import { useState, useEffect } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * Hook to get the user's browser geolocation.
 * Requests permission on mount and optionally watches for changes.
 */
export function useLocation(watch = false): LocationState {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          error: "Geolocation is not supported by this browser",
          loading: false,
        }));
      }, 0);
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
      });
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
      });
    }
  }, [watch]);

  return state;
}
