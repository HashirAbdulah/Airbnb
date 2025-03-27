"use client";
import { useState, useEffect } from "react";
import { Range } from "react-date-range";
import useLoginModal from "@/app/hooks/useLoginModal";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import DatePicker from "../forms/Calendar";
import apiService from "@/app/services/apiService";
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

export type Property = {
  id: string;
  guests: number;
  price_per_night: number;
};

interface ReservationSidebarProps {
  userId: string | null;
  property: Property;
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
  property,
  userId,
}) => {
  const loginModal = useLoginModal();
  const [fee, setFee] = useState<number>(0);
  const [nights, setNights] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [guests, setGuests] = useState<string>("1");
  const guestsRange = Array.from(
    { length: property.guests },
    (_, index) => index + 1
  );

  const performBooking = async () => {
    console.log("performBooking", userId); // Log to verify userId
    if (userId) {
      if (dateRange.startDate && dateRange.endDate) {
        const requestData = {
          guests: guests,
          start_date: format(dateRange.startDate, "yyyy-MM-dd"),
          end_date: format(dateRange.endDate, "yyyy-MM-dd"),
          number_of_nights: nights.toString(),
          total_price: totalPrice.toString(),
          guest_id: userId,
        };
        console.log("Sending data:", requestData);
        const response = await apiService.post(
          `/api/properties/${property.id}/book/`,
          requestData
        );

        if (response.success) {
          console.log("Booking successful");
        } else {
          console.log("Something went wrong...", response.error);
        }
      }
    } else {
      loginModal.open();
    }
  };
  //disable the date if it is already booked
  const getReservations = async () => {
    try {
      const response = await apiService.get(
        `/api/properties/${property.id}/reservations/`
      );

      // Ensure the response is an array
      const reservations = response.data; // Assuming response.data is an array

      let dates: Date[] = [];
      if (Array.isArray(reservations)) {
        reservations.forEach((reservation: any) => {
          const range = eachDayOfInterval({
            start: new Date(reservation.start_date),
            end: new Date(reservation.end_date),
          });
          dates = [...dates, ...range];
        });
        setBookedDates(dates);
      } else {
        console.error(
          "Expected an array of reservations, but got:",
          reservations
        );
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  //Component to set calendar Dates
  const _setDateRange = (selection: any) => {
    const newStartDate = new Date(selection.startDate);
    const newEndDate = new Date(selection.endDate);
    if (newEndDate <= newStartDate) {
      newEndDate.setDate(newStartDate.getDate() + 1);
    }
    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };
  // end of the block

  // Used chatgpt to do this:
  const airbnbServiceFeePercentage = 0.05;
  useEffect(() => {
    getReservations();
    // Calculate the base price (price per night * number of nights)
    const basePrice = property.price_per_night * nights;

    // Calculate the Airbnb service fee (15% of the base price)
    const serviceFee = basePrice * airbnbServiceFeePercentage;

    // Calculate the total price including the service fee
    const total = basePrice + serviceFee + fee; // Add any other fees, like cleaning fee

    setTotalPrice(total);
  }, [nights, fee, property.price_per_night]);

  // end of block for calculating platform fee.

  const guestRange = Array.from(
    { length: property.guests },
    (_, index) => index + 1
  );
  useEffect(() => {
    getReservations();
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);
      if (dayCount && property.price_per_night) {
        const _fee = ((dayCount * property.price_per_night) / 100) * 5;
        setFee(_fee);
        setTotalPrice(dayCount * property.price_per_night + _fee);
        setNights(dayCount);
      } else {
        const _fee = ((dayCount * property.price_per_night) / 100) * 5;
        setFee(_fee);
        setTotalPrice(dayCount * property.price_per_night + _fee);
        setNights(1);
      }
    }
  }, [dateRange]);

  return (
    <aside className="mt-4 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
      <h2 className="mb-5 text-2xl">${property.price_per_night} Per Night</h2>
      <div className="w-full mb-6">
        <DatePicker
          value={dateRange}
          bookedDates={bookedDates}
          onChange={(value) => _setDateRange(value.selection)}
        />
      </div>
      <div className="mb-6 p-3 border border-gray-400 rounded-xl">
        <label htmlFor="guests" className="mb-1 block font-bold text-xs">
          Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          id="guests"
          className="w-full -ml-1 text-xs"
        >
          {guestRange.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>

      <div
        onClick={performBooking}
        className="cursor-pointer w-full mb-4 py-4 text-center text-white bg-airbnb rounded-xl
        transition duration-300 ease-in-out transform hover:bg-airbnb-dark hover:scale-102"
      >
        Book
      </div>

      <div className="mb-4 flex align-center justify-between ">
        <p>
          ${property.price_per_night} * {nights} nights
        </p>
        <p>${property.price_per_night * nights}</p>
      </div>

      <div className="mb-4 flex align-center justify-between ">
        <p>Cleaning Fee</p>
        <p>${fee.toFixed(2)}</p>
      </div>

      <div className="mb-4 flex align-center justify-between ">
        <p>Airbnb service fee</p>
        <p>
          $
          {(
            property.price_per_night *
            nights *
            airbnbServiceFeePercentage
          ).toFixed(2)}
        </p>
      </div>

      <hr className="border-1 border-gray-500 my-2" />

      <div className="mb-4 flex align-center justify-between font-bold">
        <p>Total</p>
        <p>${totalPrice}</p>
      </div>
    </aside>
  );
};

export default ReservationSidebar;
