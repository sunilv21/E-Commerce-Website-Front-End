export default function CreditCardIcons() {
  return (
    <div className="flex space-x-2">
      <div className="h-6 w-10 rounded border bg-white p-1">
        <img src="/visa-icon.png" alt="Visa" className="h-full w-full object-contain" />
      </div>
      <div className="h-6 w-10 rounded border bg-white p-1">
        <img src="/mastercard-icon.png" alt="Mastercard" className="h-full w-full object-contain" />
      </div>
      <div className="h-6 w-10 rounded border bg-white p-1">
        <img src="/amex-icon.png" alt="American Express" className="h-full w-full object-contain" />
      </div>
      <div className="h-6 w-10 rounded border bg-white p-1">
        <img src="/discover-icon.png" alt="Discover" className="h-full w-full object-contain" />
      </div>
    </div>
  )
}
