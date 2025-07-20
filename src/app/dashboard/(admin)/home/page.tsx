"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sunrise, CloudRain, Ship } from "lucide-react";
import Admin from "../../page";
const Home = () => {
  return (
    <Admin>
      <div className="flex justify-center items-center grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white">
        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Temperature / Humidity</CardTitle>
            <CardDescription>Monitoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Sunrise size={50} />
            <Label className="text-2xl font-bold">33.2°C</Label>
          </CardContent>
        </Card>

        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Weather / Sea</CardTitle>
            <CardDescription>Monitoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CloudRain size={50} />
            <Label className="text-2xl font-bold">Rainy</Label>
          </CardContent>
        </Card>

        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Wave</CardTitle>
            <CardDescription>Monitoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Ship size={50} />
            <Label className="text-2xl font-bold">1.2m</Label>
          </CardContent>
        </Card>

        <Card className="w-full h-64 p-4">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Label className="text-2xl font-bold">Available</Label>
          </CardContent>
        </Card>
      </div>
    </Admin>
  );
};

export default Home;
