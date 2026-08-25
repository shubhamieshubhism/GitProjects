"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service, ServiceType } from "@prisma/client";

const bookingSchema = z.object({
  serviceType: z.enum(["BRIDAL", "PARTY", "AIRBRUSH", "TRIAL", "EDITORIAL", "OTHER"]),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedDate = watch("date");
  const selectedService = watch("serviceType");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => toast.error("Failed to load services"));
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetch(`/api/availability?date=${selectedDate}&service=${selectedService}`)
        .then((res) => res.json())
        .then((data) => setAvailableSlots(data.slots || []))
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedDate, selectedService]);

  const onSubmit = async (data: BookingFormData) => {
    if (!session) {
      toast.error("Please login to book an appointment");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to book");
      toast.success("Appointment booked! Check your email for confirmation.");
      router.push("/user/appointments");
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="serviceType">Select Service *</Label>
        <select
          id="serviceType"
          className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          {...register("serviceType")}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.serviceType}>
              {s.title} - ${s.price} ({s.duration} min)
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <p className="text-sm text-destructive mt-1">{errors.serviceType.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          {...register("date")}
        />
        {errors.date && (
          <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="timeSlot">Time Slot *</Label>
        <select
          id="timeSlot"
          className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          {...register("timeSlot")}
          disabled={!availableSlots.length}
        >
          <option value="">Select a time</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.timeSlot && (
          <p className="text-sm text-destructive mt-1">{errors.timeSlot.message}</p>
        )}
        {availableSlots.length === 0 && selectedDate && (
          <p className="text-sm text-muted-foreground mt-1">
            No slots available for this date. Please choose another.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Special Requests (optional)</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  );
}