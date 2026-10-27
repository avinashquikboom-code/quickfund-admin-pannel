export function Badge({ value }: { value: string }) {
  return (
    <span
      className={`badge ${/Approved|Active|Completed|Paid|Success|Delivered|Resolved|^Configured$/.test(value) ? "green" : /Rejected|Failed|Suspended|Overdue|High/.test(value) ? "red" : "amber"}`}
    >
      <i />
      {value}
    </span>
  );
}
export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar">
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
