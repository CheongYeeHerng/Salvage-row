"use client";

import { useState } from "react";
import { getSellerContact } from "@/data/sellers";

export default function ContactSellerButton({ seller }: { seller: string }) {
  const [open, setOpen] = useState(false);
  const contact = getSellerContact(seller);

  if (!contact) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="px-4 py-2 border border-dust-line hover:bg-paper-dim transition-colors"
      >
        {open ? "Hide contact details" : "Contact seller"}
      </button>

      {open && (
        <div className="mt-2 border border-dust-line bg-paper-dim/40 text-sm max-w-xs">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-dust-line">
                <td className="px-3 py-2 text-dust w-24">Seller</td>
                <td className="px-3 py-2">{seller}</td>
              </tr>
              <tr className="border-b border-dust-line">
                <td className="px-3 py-2 text-dust">Phone</td>
                <td className="px-3 py-2">{contact.phone}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-dust">Email</td>
                <td className="px-3 py-2 break-all">{contact.email}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-dust px-3 py-2 border-t border-dust-line">
            Simulated contact details for this demo — not a real seller.
          </p>
        </div>
      )}
    </div>
  );
}
