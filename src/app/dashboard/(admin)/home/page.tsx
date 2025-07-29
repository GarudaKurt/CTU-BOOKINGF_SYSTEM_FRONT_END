"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/api/api";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Label as RechartsLabel } from "recharts";
import { Sunrise, CloudRain, Ship } from "lucide-react";
import Admin from "../../page";
import { Monitoring } from "@/stores/monitoring";

const Home = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      if (users && Array.isArray(users)) {
        setTotalUsers(users.length);
      }
    };

    fetchUsers();
  }, []);

  const data = [
    { name: "Users", value: totalUsers },
    { name: "Remaining", value: 100 - totalUsers }, // Example placeholder
  ];

  const {
    temperature,
    humidity,
    weatherCode,
    waveHeight,
    loading,
    fetchMonitoringData,
  } = Monitoring();

  useEffect(() => {
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  return (
    <Admin>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6 bg-white">
        {/* Temperature / Humidity */}
        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Temperature / Humidity</CardTitle>
            <CardDescription>Monitoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Sunrise size={40} />
            <Label className="text-xl font-bold">
              {loading || temperature === null || humidity === null
                ? "Loading..."
                : `${temperature}°C / ${humidity}%`}
            </Label>
          </CardContent>
        </Card>

        {/* Weather / Sea */}
        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Weather / Sea</CardTitle>
            <CardDescription>Monitoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CloudRain size={40} />
            <Label className="text-xl font-bold">
              {loading || !weatherCode ? "Loading..." : weatherCode}
            </Label>
          </CardContent>
        </Card>

        {/* Wave */}
        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Wave</CardTitle>
            <CardDescription>Monitoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Ship size={40} />
            <Label className="text-xl font-bold">
              {loading || waveHeight === null ? "Loading..." : `${waveHeight}m`}
            </Label>
          </CardContent>
        </Card>

        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Total Registered Users</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <PieChart width={160} height={160}>
              <Pie
                data={[
                  { name: "Users", value: totalUsers },
                  { name: "Other", value: totalUsers === 0 ? 1 : 0 }, // avoid empty chart
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#FFC20A"
                label={({ name, value }) => `${name}: ${value}`}
              >
                <RechartsLabel
                  value={`${totalUsers} Users`}
                  position="center"
                  style={{ fontSize: 12, fontWeight: "bold" }}
                />
              </Pie>
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </Admin>
  );
};

export default Home;
