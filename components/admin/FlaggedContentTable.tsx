"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuth, getIdTokenResult } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Report, ReportStatus, PaginatedResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { Input } from "@/components/ui/input";
import { Select } from "antd";
import { useDebounce } from "@/hooks/use-debounce";

export function FlaggedContentTable() {
  const auth = getAuth();
  const [user, authLoading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  const fetchReports = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
        search: debouncedSearch,
      });

      const response = await fetch(`/api/moderation?${params}`);
      const result: PaginatedResponse<Report> = await response.json();

      if (result.success && result.data) {
        setReports(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, statusFilter, pagination.page, pagination.per_page, debouncedSearch]);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);
    getIdTokenResult(user, true)
      .then((idTokenResult) => {
        setIsAdmin(Boolean(idTokenResult.claims.is_admin));
      })
      .catch((error) => {
        console.error("Failed to get admin claim:", error);
        setIsAdmin(false);
      })
      .finally(() => {
        setAdminLoading(false);
      });
  }, [user]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResolve = async (reportId: string, action: "reviewed" | "dismissed") => {
    const note = prompt(`Enter resolution note for ${action}:`);
    if (note === null) return;

    try {
      const response = await fetch(`/api/moderation/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          resolution_note: note || `Report ${action} by admin`,
        }),
      });

      if (response.ok) {
        fetchReports();
      } else {
        const err = await response.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} report:`, error);
    }
  };

  if (authLoading || adminLoading) return <div>Loading auth...</div>;
  if (!isAdmin) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Flagged Content</h2>
        <div className="flex flex-1 gap-2 sm:max-w-md">
          <Input
            placeholder="Search by reason or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            value={statusFilter}
            onChange={(value: ReportStatus) => setStatusFilter(value)}
            className="w-32"
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="reviewed">Reviewed</Select.Option>
            <Select.Option value="dismissed">Dismissed</Select.Option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Reason</th>
                <th className="px-4 py-3 text-left font-medium">Target</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 align-top font-medium capitalize">
                      {report.reason}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">
                          {report.target_type}
                        </span>
                        <span className="truncate max-w-30" title={report.target_id}>
                          {report.target_id.split('-')[0]}...
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top max-w-xs">
                      <p className="line-clamp-2 text-muted-foreground">
                        {report.description || "No description provided."}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        report.status === 'reviewed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex flex-col items-end gap-2">
                        {report.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                              onClick={() => handleResolve(report.id, "reviewed")}
                            >
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => handleResolve(report.id, "dismissed")}
                            >
                              Dismiss
                            </Button>
                          </div>
                        )}
                        {report.target_type === 'user' && (
                          <ModerationActions
                            userId={report.target_id}
                            onActionComplete={() => fetchReports()}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
