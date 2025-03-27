import Image from "next/image";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import apiService from "@/app/services/apiService";
import { getUserId } from "../../lib/action";
import Link from "next/link";
interface PropertyDetailPageProps {
  params: { id: string };
}

const PropertyDetailPage = async ({ params }: PropertyDetailPageProps) => {
  const userId = await getUserId();

  const response = await apiService.get(`/api/properties/${params.id}`);
  const property = await response.data;

  let landlord = null;
  if (typeof property.landlord === "string") {
    const landlordResponse = await apiService.get(
      `/api/landlords/${property.landlord}/`
    );
    landlord = landlordResponse;
  } else {
    landlord = property.landlord;
  }

  if (!landlord) {
    return <div>Landlord data not found.</div>;
  }
  if (!property) {
    return <div>Property not found.</div>;
  }
  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6">
      {/* Image Section */}
      <div className="mb-6 w-full h-[64vh] overflow-hidden rounded-xl relative">
        <Image
          fill
          src="/beach_img.jpg"
          className="object-cover"
          alt="Beach Image"
        />
      </div>

      {/* Property Information */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="pr-6 col-span-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {property.title}
          </h1>
          <span className="my-4 block text-lg text-gray-600">
            {property.guests} Guests - {property.bedrooms} Bedrooms -{" "}
            {property.bathrooms} Bathrooms
          </span>
          <hr className="border-gray-300 mb-6" />

          {/* Profile Picture and Info */}
          <Link
            href={`/landlords/${property.landlord.id}`}
            className="py-4 flex items-center space-x-4"
          >
            <div className="relative">
              {property.landlord.profile_image_url && (
                <Image
                  src={property.landlord.profile_image_url}
                  alt="Profile"
                  height={50}
                  width={50}
                  className="rounded-full border-2 border-white shadow-md transition-transform hover:scale-105"
                />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">
                {property.landlord.name} - is your Host
              </p>
              <p className="text-xs text-gray-500">Host Description or Info</p>
            </div>
          </Link>
          {/* Property Description */}
          <div className="mt-6 text-lg text-gray-700">
            <p>{property.description}</p>
          </div>
        </div>

        {/* Reservation Sidebar */}
        <ReservationSidebar property={property} userId={userId} />
      </div>
    </main>
  );
};

export default PropertyDetailPage;
