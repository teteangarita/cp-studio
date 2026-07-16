import React, { useReducer, useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Package } from "lucide-react";

// ---------------------------------------------------------------
// Este patrón (reducer + acciones + estado centralizado) es el
// mismo que usarías con Redux real: en vez de useReducer local,
// el store viviría en un store.js global compartido por toda la app.
// ---------------------------------------------------------------

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "DECREASE": {
      return {
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    }
    default:
      return state;
  }
}

const PRODUCTS = [
  { id: 1, name: "Consultoría TI (hora)", price: 25000, icon: "💼" },
  { id: 2, name: "Desarrollo módulo a medida", price: 180000, icon: "🧩" },
  { id: 3, name: "Mantenimiento mensual", price: 90000, icon: "🛠️" },
  { id: 4, name: "Migración a la nube", price: 220000, icon: "☁️" },
];

const money = (n) => n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function App() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [open, setOpen] = useState(false);

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = state.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header — lee el estado global del carrito */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Package size={22} className="text-teal-400" />
          <span className="font-semibold tracking-tight">TechFlow Consultora</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="relative flex items-center gap-2 bg-teal-500 hover:bg-teal-400 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
        >
          <ShoppingCart size={18} />
          Carrito
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Servicios disponibles</h1>
        <p className="text-slate-500 mb-8 text-sm">
          Ejemplo de estado global compartido entre componentes — patrón usado con Redux en apps reales.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="font-medium text-slate-800">{p.name}</p>
                  <p className="text-teal-600 text-sm font-semibold">{money(p.price)}</p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: "ADD_ITEM", payload: p })}
                className="bg-slate-900 hover:bg-slate-700 text-white text-sm px-3 py-2 rounded-lg font-medium"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Panel lateral del carrito — se sincroniza automáticamente con el reducer */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-20" onClick={() => setOpen(false)}>
          <div className="bg-white w-80 h-full p-6 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4 text-slate-800">Tu carrito</h2>
            {state.items.length === 0 && (
              <p className="text-slate-400 text-sm">Aún no has agregado servicios.</p>
            )}
            <div className="flex-1 space-y-3 overflow-auto">
              {state.items.map((i) => (
                <div key={i.id} className="border border-slate-100 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-slate-700">{i.name}</p>
                    <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: i.id })}>
                      <Trash2 size={15} className="text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch({ type: "DECREASE", payload: i.id })}
                        className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-4 text-center">{i.qty}</span>
                      <button
                        onClick={() => dispatch({ type: "ADD_ITEM", payload: i })}
                        className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">{money(i.price * i.qty)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
