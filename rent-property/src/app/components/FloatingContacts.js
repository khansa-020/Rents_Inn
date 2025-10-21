"use client";
import Image from "next/image";

export default function FloatingContacts() {
  const PHONE = "+923033304987";
  const WHATSAPP = "+923033304987";

  const waHref = `https://wa.me/${WHATSAPP.replace(/[^\d]/g, "")}`;
  const telHref = `tel:${PHONE.replace(/\s/g, "")}`;

  return (
    <div className="floating-contacts">
      <a
        className="floating-btn"
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <Image
          src="/ws.png"
          alt="WhatsApp"
          width={40}   // bigger
          height={40}  // bigger
        />
      </a>
      <a
        className="floating-btn"
        href={telHref}
        aria-label={`Call ${PHONE}`}
      >
        <Image
          src="/ph.png"
          alt="Call"
          width={40}
          height={40}
        />
      </a>
    </div>
  );
}
