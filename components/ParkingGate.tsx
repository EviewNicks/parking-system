import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Scan,
  Users,
  Activity,
} from "lucide-react";

interface VehicleData {
  id: string;
  licensePlate: string;
  vehicleType: "car" | "truck" | "motorcycle";
  accessLevel: "authorized" | "visitor" | "denied";
  timestamp: Date;
}

interface ParkingGateProps {
  gateId?: string;
  location?: string;
  maxCapacity?: number;
  currentOccupancy?: number;
}

const ParkingGate: React.FC<ParkingGateProps> = ({
  gateId = "GATE-001",
  location = "Main Entrance",
  maxCapacity = 150,
  currentOccupancy = 87,
}) => {
  const [gateStatus, setGateStatus] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [trafficLight, setTrafficLight] = useState<"red" | "yellow" | "green">(
    "red"
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleData | null>(
    null
  );
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);

  const mockVehicles: VehicleData[] = [
    {
      id: "1",
      licensePlate: "ABC-123",
      vehicleType: "car",
      accessLevel: "authorized",
      timestamp: new Date(),
    },
    {
      id: "2",
      licensePlate: "XYZ-789",
      vehicleType: "truck",
      accessLevel: "visitor",
      timestamp: new Date(),
    },
    {
      id: "3",
      licensePlate: "DEF-456",
      vehicleType: "car",
      accessLevel: "denied",
      timestamp: new Date(),
    },
  ];

  const simulateVehicleDetection = () => {
    setIsDetecting(true);
    const randomVehicle =
      mockVehicles[Math.floor(Math.random() * mockVehicles.length)];

    setTimeout(() => {
      setCurrentVehicle(randomVehicle);
      setIsDetecting(false);

      if (
        randomVehicle.accessLevel === "authorized" ||
        randomVehicle.accessLevel === "visitor"
      ) {
        setAccessGranted(true);
        setTrafficLight("green");
        setGateStatus("opening");

        setTimeout(() => {
          setGateStatus("open");
        }, 1500);

        setTimeout(() => {
          setGateStatus("closing");
          setTrafficLight("yellow");
        }, 4000);

        setTimeout(() => {
          setGateStatus("closed");
          setTrafficLight("red");
          setCurrentVehicle(null);
          setAccessGranted(null);
        }, 6000);
      } else {
        setAccessGranted(false);
        setTrafficLight("red");

        setTimeout(() => {
          setCurrentVehicle(null);
          setAccessGranted(null);
        }, 3000);
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "authorized":
        return "bg-teal-500";
      case "visitor":
        return "bg-blue-500";
      case "denied":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrafficLightColor = () => {
    switch (trafficLight) {
      case "red":
        return "bg-red-500";
      case "yellow":
        return "bg-yellow-500";
      case "green":
        return "bg-teal-500";
    }
  };

  const occupancyPercentage = (currentOccupancy / maxCapacity) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Parking Gate Control
          </h1>
          <p className="text-muted-foreground">
            {location} - {gateId}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Activity className="w-4 h-4 mr-2" />
          System Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Gate Control */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gate Visualization */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Gate Status & Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Traffic Light */}
              <div className="flex items-center justify-center">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div
                    className={`w-12 h-12 rounded-full ${getTrafficLightColor()} shadow-lg transition-all duration-300`}
                  >
                    <div
                      className={`w-full h-full rounded-full ${
                        trafficLight === "green" ? "animate-pulse" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Gate Barrier */}
              <div className="relative bg-gray-100 h-32 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-2 bg-gray-300 relative">
                    <div
                      className={`absolute left-1/2 w-24 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded transition-transform duration-1500 origin-left ${
                        gateStatus === "open" || gateStatus === "opening"
                          ? "rotate-90"
                          : "rotate-0"
                      }`}
                      style={{ transformOrigin: "left center" }}
                    />
                  </div>
                </div>

                {/* Vehicle Detection Zone */}
                <div
                  className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                    isDetecting
                      ? "scale-110 opacity-100"
                      : "scale-100 opacity-70"
                  }`}
                >
                  <div
                    className={`w-16 h-10 rounded border-2 border-dashed ${
                      isDetecting
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-400"
                    } flex items-center justify-center`}
                  >
                    <Car
                      className={`w-6 h-6 ${
                        isDetecting ? "text-teal-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Gate Status */}
              <div className="text-center">
                <Badge
                  variant={gateStatus === "open" ? "default" : "secondary"}
                  className={`text-lg px-6 py-2 ${
                    gateStatus === "open" ? "bg-teal-500 hover:bg-teal-600" : ""
                  }`}
                >
                  {gateStatus.charAt(0).toUpperCase() + gateStatus.slice(1)}
                </Badge>
              </div>

              {/* Control Button */}
              <div className="flex justify-center">
                <Button
                  onClick={simulateVehicleDetection}
                  disabled={isDetecting || gateStatus !== "closed"}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {isDetecting ? "Detecting..." : "Simulate Vehicle"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Detection Display */}
          {currentVehicle && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-teal-600" />
                  Vehicle Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">License Plate:</span>
                    <Badge variant="outline" className="text-lg">
                      {currentVehicle.licensePlate}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Vehicle Type:</span>
                    <span className="capitalize text-muted-foreground">
                      {currentVehicle.vehicleType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Access Level:</span>
                    <Badge
                      className={`${getStatusColor(
                        currentVehicle.accessLevel
                      )} text-white`}
                    >
                      {currentVehicle.accessLevel}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-center">
                    {accessGranted === true && (
                      <div className="flex items-center gap-2 text-teal-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Access Granted</span>
                      </div>
                    )}
                    {accessGranted === false && (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-6 h-6" />
                        <span className="font-medium">Access Denied</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Parking Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Parking Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy</span>
                  <span>
                    {currentOccupancy}/{maxCapacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      occupancyPercentage > 90
                        ? "bg-red-500"
                        : occupancyPercentage > 70
                        ? "bg-yellow-500"
                        : "bg-teal-500"
                    }`}
                    style={{ width: `${occupancyPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {occupancyPercentage.toFixed(1)}% occupied
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Available Spots</span>
                  <Badge variant="outline">
                    {maxCapacity - currentOccupancy}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gate Status</span>
                  <Badge
                    variant={gateStatus === "open" ? "default" : "secondary"}
                  >
                    {gateStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Barrier Motor</span>
                <Badge className="bg-teal-500 text-white">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vehicle Sensors</span>
                <Badge className="bg-teal-500 text-white">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Traffic Light</span>
                <Badge className="bg-teal-500 text-white">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Access Control</span>
                <Badge className="bg-teal-500 text-white">Connected</Badge>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Last maintenance: 2 days ago
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParkingGate;
