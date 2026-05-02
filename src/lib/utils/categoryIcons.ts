/**
 * Maps category/subcategory names to Lucide icon components.
 * Used across the Budget page, Dashboard category list, and transaction detail.
 */
import {
ShoppingCart, Utensils, Car, Home, Zap, Wifi, Phone, Heart,
Dumbbell, Plane, Train, Film, Music, BookOpen, GraduationCap,
Baby, PawPrint, Shirt, Gift, Coffee, Beer, Banknote, TrendingUp,
TrendingDown, ArrowUpRight, ArrowDownLeft, Building2, CreditCard,
Receipt, Hammer, Leaf, Fuel, Stethoscope, Pill, Wrench, Package, Tag
} from 'lucide-svelte';
import { SvelteComponentTyped } from 'svelte';

// Use the base class as the type so all lucide icons are assignable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = typeof SvelteComponentTyped<any>;

const CATEGORY_ICONS: Record<string, IconComponent> = {
// Food & drink
mat: Utensils,
dagligvarer: ShoppingCart,
restaurant: Utensils,
kafe: Coffee,
kafé: Coffee,
café: Coffee,
takeaway: Utensils,
alkohol: Beer,
bar: Beer,

// Transport
transport: Car,
bil: Car,
parkering: Car,
buss: Train,
tog: Train,
taxi: Car,
drivstoff: Fuel,
bensin: Fuel,

// Housing
bolig: Home,
husleie: Home,
lån: Banknote,
strøm: Zap,
elektrisitet: Zap,
internett: Wifi,
bredbånd: Wifi,
telefon: Phone,
mobil: Phone,
vedlikehold: Wrench,
oppussing: Hammer,

// Health
helse: Stethoscope,
lege: Stethoscope,
apotek: Pill,
medisin: Pill,
tannlege: Stethoscope,
trening: Dumbbell,
gym: Dumbbell,

// Entertainment
underholdning: Film,
kino: Film,
streaming: Film,
musikk: Music,
spill: Film,
sport: Dumbbell,

// Shopping
shopping: ShoppingCart,
klær: Shirt,
elektronikk: Package,
gaver: Gift,
gave: Gift,

// Travel
reise: Plane,
fly: Plane,
hotell: Building2,
ferie: Plane,

// Education
utdanning: GraduationCap,
bøker: BookOpen,
kurs: GraduationCap,

// Kids & family
barn: Baby,
barnehage: Baby,
dyr: PawPrint,
kjæledyr: PawPrint,

// Finance
sparing: TrendingUp,
investering: TrendingUp,
inntekt: ArrowDownLeft,
lønn: ArrowDownLeft,
overføring: ArrowUpRight,
avgift: CreditCard,
gebyr: CreditCard,
skatt: Building2,
forsikring: Building2,

// Nature / subscriptions
abonnement: Receipt,
natur: Leaf,
miljø: Leaf,

// Merchant categories (BankNorwegian)
retail: ShoppingCart,
grocery: ShoppingCart,
'food & beverage': Utensils,
travel: Plane,
airlines: Plane,
hotel: Building2,
'car rental': Car,
entertainment: Film,
health: Stethoscope,
education: GraduationCap,
'home improvement': Hammer,
electronics: Package,
clothing: Shirt,
'financial services': Banknote,
fuel: Fuel,
telecom: Phone,
};

/** Returns the best-matching Lucide icon for a category name. Falls back to Tag. */
export function getCategoryIcon(category: string): IconComponent {
const key = category.toLowerCase().trim();
if (CATEGORY_ICONS[key]) return CATEGORY_ICONS[key];
for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
if (key.includes(k) || k.includes(key)) return icon;
}
return Tag;
}

/** Returns a consistent accent color for a category (deterministic hash). */
export function getCategoryColor(category: string): string {
const colors = [
'#5c6ac4', '#22863a', '#d73a49', '#f5a623',
'#9b59b6', '#1abc9c', '#e67e22', '#3498db',
'#e74c3c', '#2ecc71', '#f39c12', '#8e44ad'
];
let hash = 0;
for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) | 0;
return colors[Math.abs(hash) % colors.length];
}
