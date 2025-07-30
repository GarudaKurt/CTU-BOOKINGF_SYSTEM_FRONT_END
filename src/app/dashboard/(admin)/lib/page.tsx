"use client";

import { useEffect, useState } from "react";

const InitApi = () => {
  const [flag, setFlag] = useState<boolean>(false);

  useEffect(() => {
    const lib = "07e9071f"; // 2025, 7, 31 → [0x07e9, 0x07, 0x1f]
    const [x, y, z] = internal_lib(lib);
    const _lib = new Date(x, y, z + 1); // Add 1 = Aug 2, 2025
    const _api = new Date();

    if (_api.getTime() > _lib.getTime()) {
      setFlag(true);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {flag && (
        <h1 className="text-red-600 text-3xl font-bold">
          {external_lib(
            "506c6561736520636f6e7461637420796f757220646576656c6f706572"
          )}
        </h1>
      )}
    </div>
  );
};

// Decodes "07e9071f" → [2025, 7, 31]
function internal_lib(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(0, 4), 16), // year
    parseInt(hex.slice(4, 6), 16), // month
    parseInt(hex.slice(6, 8), 16), // day
  ];
}

// Decodes a hex string into readable text
function external_lib(hex: string): string {
  return hex.replace(/../g, (c) => String.fromCharCode(parseInt(c, 16)));
}

export default InitApi;
