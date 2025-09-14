
"use client"; 

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { AdminColumns } from "@/components/table/AdminColumns";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/appwrite.types"; // Import Appointment type
import { Doctors } from "@/constants"; // Import danh sách bác sĩ
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRecentAppointmentList } from "@/lib/actions/apointment.actions";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ scheduled: 0, pending: 0, cancelled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [doctorFilter, setDoctorFilter] = useState("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      const data = await getRecentAppointmentList();
      if (data) {
        setAppointments(data.documents);
        setStats({
          scheduled: data.scheduledCount,
          pending: data.pendingCount,
          cancelled: data.cancelledCount,
        });
      }
      setIsLoading(false);
    };

    fetchAppointments();
  }, []);

  const filteredAppointments =
    doctorFilter === "all"
      ? appointments
      : appointments.filter(
          (app) => app.primaryPhysician === doctorFilter
        );

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14 p-4 md:p-8">
      <header className="admin-header">
        <Link href="/admin" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-16-semibold">Admin Dashboard</p>
          <Button asChild variant="outline">
            <Link href="/admin/patients">Quản lý bệnh nhân</Link>
          </Button>
        </div>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Chào mừng, Admin 👋</h1>
          <p className="text-text-secondary">
            Quản lý tất cả các cuộc hẹn và hồ sơ bệnh nhân từ đây.
          </p>
        </section>
        
        {/* Thống kê */}
        <section className="admin-stat">
          <StatCard type="appointments" count={stats.scheduled} label="Scheduled appointments" icon={"/assets/icons/appointments.svg"} />
          <StatCard type="pending" count={stats.pending} label="Pending appointments" icon={"/assets/icons/pending.svg"} />
          <StatCard type="cancelled" count={stats.cancelled} label="Cancelled appointments" icon={"/assets/icons/cancelled.svg"} />
        </section>

        {/* Bảng dữ liệu và bộ lọc */}
        <div className="data-table p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Tất cả cuộc hẹn</h2>
                <div className="w-full max-w-xs">
                    <Select onValueChange={setDoctorFilter} defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Doctors</SelectItem>
                            {Doctors.map((doc) => (
                                <SelectItem key={doc.name} value={doc.name}>
                                    Dr. {doc.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center p-8">Đang tải cuộc hẹn...</div>
            ) : (
                <DataTable columns={AdminColumns} data={filteredAppointments} />
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;