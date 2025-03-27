"use client";
import { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiSerivce from "@/app/services/apiService";
export type PropertyType = {
  id: string;
  title: string;
  price_per_night: number;
  image_url: string;
};
const PropertyList = () => {
  const [properties, setproperties] = useState<PropertyType[]>([]);
  const getProperties = async () => {
    const tmpProperties = await apiSerivce.get("/api/properties/");
    setproperties(tmpProperties.data);
  };
  useEffect(() => {
    getProperties();
  }, []);

  return (
    <>
      {properties.map((property) => {
        return <PropertyListItem key={property.id} property={property} />;
      })}
    </>
  );
};

export default PropertyList;
