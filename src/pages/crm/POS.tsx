import { useState, useMemo } from 'react';
import { useCRM, MenuItem } from '../../context/CRMDataContext';
import {
    Search, Plus, Minus, Trash2, ShoppingCart,
    UtensilsCrossed, ReceiptText, ChevronRight, Check
} from 'lucide-react';
import { toast } from 'sonner';

type CartItem = {
    menuItem: MenuItem;
    quantity: number;
    notes: string;
};

export default function POS() {
    const { menuCategories, menuItems, restaurantTables, addFoodOrder } = useCRM();

    const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Order Context State
    const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    // Checkout Modal State
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
    const [isProcessing, setIsProcessing] = useState(false);

    // Derived Data
    const availableItems = useMemo(() => {
        let items = menuItems.filter(i => i.is_available);
        if (activeCategory !== 'all') {
            items = items.filter(i => i.category_id === activeCategory);
        }
        if (searchQuery) {
            items = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return items;
    }, [menuItems, activeCategory, searchQuery]);

    const cartTotals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
        const taxRate = 0.05; // Assuming 5% GST for restaurant
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [cart]);

    // Cart Actions
    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.menuItem.id === item.id);
            if (existing) {
                return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { menuItem: item, quantity: 1, notes: '' }];
        });
    };

    const updateQuantity = (itemId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.menuItem.id === itemId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => setCart([]);

    // Checkout Process
    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");
        // No longer strictly requiring a table for dine-in, as some restaurants just bring the bill to the customer without formal table tracking.

        setIsProcessing(true);
        try {
            const orderData = {
                table_id: selectedTable || null,
                order_type: orderType,
                customer_name: customerName,
                customer_phone: customerPhone,
                status: 'pending' as const,
                total_amount: cartTotals.total,
                gst_amount: cartTotals.tax,
                payment_status: 'paid' as const,
                payment_method: paymentMethod,
                notes: ''
            };

            const orderItemsData = cart.map(item => ({
                menu_item_id: item.menuItem.id,
                item_name: item.menuItem.name,
                quantity: item.quantity,
                unit_price: item.menuItem.price,
                notes: item.notes
            }));

            await addFoodOrder(orderData, orderItemsData);
            toast.success("Order placed successfully");

            // Trigger printing the receipt
            setTimeout(() => {
                window.print();
            }, 100);

            // Wait a moment before clearing to allow print dialog to capture the DOM
            setTimeout(() => {
                clearCart();
                setCustomerName('');
                setCustomerPhone('');
                setSelectedTable(null);
                setShowCheckout(false);
            }, 500);
        } catch (error: any) {
            toast.error(error.message || "Failed to place order");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 print:hidden">

                {/* LEFT PANE: Menu & Search */}
                <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header & Search */}
                    <div className="p-4 border-b border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight text-[#0E2A38]">Point of Sale</h2>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search menu..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E2A38]/20 transition-all"
                                />
                            </div>
                        </div>
                        {/* Categories Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'all' ? 'bg-[#0E2A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All Items
                            </button>
                            {menuCategories.filter(c => c.is_active).map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-[#0E2A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {availableItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => addToCart(item)}
                                    className="text-left bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#0E2A38]/30 transition-all group active:scale-[0.98] flex flex-col"
                                >
                                    <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                <UtensilsCrossed size={32} strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <span className={`w-4 h-4 rounded-sm border-[2px] flex items-center justify-center bg-white/90 backdrop-blur-sm ${item.is_veg ? 'border-green-600' : 'border-red-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full z-10 ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 flex flex-col flex-1 justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 leading-tight mb-1">{item.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                            <p className="font-bold text-[#0E2A38]">₹{item.price}</p>
                                            <div className="w-6 h-6 rounded-md bg-[#0E2A38]/5 text-[#0E2A38] flex items-center justify-center group-hover:bg-[#0E2A38] group-hover:text-white transition-colors">
                                                <Plus size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {availableItems.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-400">
                                    <UtensilsCrossed size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>No items found in this category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANE: Cart & Checkout */}
                <div className="w-full md:w-96 flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden shrink-0">
                    {/* Order Context Details */}
                    <div className="p-4 border-b border-gray-100 bg-[#F8F9FB] space-y-3">
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 p-0.5 bg-white shadow-sm">
                            {(['dine_in', 'takeaway', 'delivery'] as const).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setOrderType(type)}
                                    className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${orderType === type ? 'bg-[#0E2A38] text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {type.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        {orderType === 'dine_in' && (
                            <select
                                value={selectedTable || ''}
                                onChange={e => setSelectedTable(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/20 bg-white"
                            >
                                <option value="">Select Table...</option>
                                {restaurantTables.map(t => (
                                    <option key={t.id} value={t.id}>Table {t.table_number}</option>
                                ))}
                            </select>
                        )}

                        {(orderType === 'takeaway' || orderType === 'delivery') && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/20"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={customerPhone}
                                    onChange={e => setCustomerPhone(e.target.value)}
                                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/20"
                                />
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
                        {cart.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <ShoppingCart size={48} strokeWidth={1} className="mb-4 opacity-30" />
                                <p className="text-sm font-medium">Your cart is empty</p>
                                <p className="text-xs mt-1">Tap items to add them to the bill</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.menuItem.id} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <p className="font-semibold text-sm text-gray-900 truncate pr-2 pr-2">{item.menuItem.name}</p>
                                            <p className="font-semibold text-sm text-[#0E2A38]">₹{item.menuItem.price * item.quantity}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">₹{item.menuItem.price} each</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100 self-start">
                                        <button onClick={() => updateQuantity(item.menuItem.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all">
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.menuItem.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-[#0E2A38] hover:shadow-sm transition-all">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bill Summary */}
                    <div className="p-5 border-t border-gray-100 bg-white">
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{cartTotals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Tax (5%)</span>
                                <span className="font-medium text-gray-900">₹{cartTotals.tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t border-dashed border-gray-200 mt-2 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-[#C9A646]">₹{cartTotals.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {!showCheckout ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={clearCart}
                                    disabled={cart.length === 0}
                                    className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Clear Cart"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    disabled={cart.length === 0}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0E2A38] text-white rounded-xl font-bold shadow-md hover:bg-[#1a3d4f] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ReceiptText size={18} /> Charge ₹{cartTotals.total.toFixed(0)}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="grid grid-cols-3 gap-2">
                                    {(['cash', 'card', 'upi'] as const).map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border-2 transition-colors ${paymentMethod === method ? 'border-[#0E2A38] bg-[#0E2A38]/5 text-[#0E2A38]' : 'border-gray-100 text-gray-500 hover:border-gray-200'
                                                }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isProcessing}
                                        className="flex-[2] flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-all disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Processing...' : (
                                            <>Confirm <Check size={18} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRINTABLE RECEIPT (Hidden on screen, visible only when printing) */}
            <div className="hidden print:block w-[80mm] mx-auto bg-white p-4 font-mono text-sm leading-tight text-black">
                <div className="text-center mb-4 border-b border-black pb-4">
                    <h1 className="text-xl font-bold mb-1">RESTAURANT RECEIPT</h1>
                    <p className="text-xs">Ganesh Residence</p>
                    <p className="text-xs">{new Date().toLocaleString()}</p>
                    <p className="text-xs mt-1 border border-black inline-block px-2 py-0.5 font-bold uppercase">
                        {orderType.replace('_', ' ')}
                        {selectedTable ? ` - TABLE ${restaurantTables.find(t => t.id === selectedTable)?.table_number}` : ''}
                    </p>
                </div>

                <table className="w-full mb-4">
                    <thead>
                        <tr className="border-b border-black text-xs text-left">
                            <th className="pb-1 font-bold">ITEM</th>
                            <th className="pb-1 font-bold text-center">QTY</th>
                            <th className="pb-1 font-bold text-right">AMT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(item => (
                            <tr key={item.menuItem.id} className="text-xs align-top">
                                <td className="py-1 pr-2">{item.menuItem.name}</td>
                                <td className="py-1 text-center">{item.quantity}</td>
                                <td className="py-1 text-right">₹{item.menuItem.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="border-t border-black pt-2 space-y-1 mb-4 text-xs font-bold">
                    <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>₹{cartTotals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>GST (5%):</span>
                        <span>₹{cartTotals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-t border-b border-black mt-1">
                        <span>TOTAL:</span>
                        <span>₹{cartTotals.total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center text-xs mt-6 pt-4 border-t border-black border-dashed">
                    <p>Thank you for your visit!</p>
                    <p>Please come again</p>
                </div>
            </div>
        </>
    );
}
