"use client";

import { useState } from "react";

export default function AdminNewsletterPage() {
  const [selectedSegment, setSelectedSegment] = useState("all");

 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage your email subscriber list</p>
        </div>
       
      </div>

      

    
      

   
    </div>
  );
}