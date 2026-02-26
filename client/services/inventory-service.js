// client/services/inventory-service.js
import { getItems } from "./data-store.js";

export async function getDashboardData() {
    const items = getItems();

    const totalBarang = items.length;
    const barangKritisList = items.filter((i) => i.stok <= i.stokMin);
    const barangKritis = barangKritisList.length;

    // sementara masih dummy (nanti pakai data transaksi beneran)
    const totalMasukBulan = 12;
    const totalKeluarBulan = 7;
    const bulan = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });

    return {
        totalBarang,
        barangKritis,
        totalMasukBulan,
        totalKeluarBulan,
        bulan,
        barangKritisList,
    };
}