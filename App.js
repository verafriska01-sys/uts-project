import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function App() {
  // State array untuk menyimpan semua transaksi
  const [transaksi, setTransaksi] = useState([
    { id: '1', ket: 'Uang Saku', nominal: 100000, tipe: 'masuk' },
    { id: '2', ket: 'Beli Cilok', nominal: 10000, tipe: 'keluar' },
  ]);
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');

  // Hitung total saldo menggunakan reduce
  const saldo = transaksi.reduce((total, item) => {
    return item.tipe === 'masuk'
      ? total + item.nominal
      : total - item.nominal;
  }, 0);

  // Fungsi tambah transaksi
  const tambahTransaksi = (tipe) => {
    if (!deskripsi.trim() || !nominal) return;

    const baru = {
      id: Date.now().toString(),
      ket: deskripsi,
      nominal: parseInt(nominal),
      tipe: tipe,
    };

    setTransaksi([...transaksi, baru]);
    setDeskripsi('');
    setNominal('');
  };

  // Render setiap item transaksi
  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemIcon}>
          {item.tipe === 'masuk' ? '↑' : '↓'}
        </Text>
        <Text style={styles.itemKet}>{item.ket}</Text>
      </View>
      {/* Conditional styling: hijau = masuk, merah = keluar */}
      <Text
        style={[
          styles.itemNominal,
          { color: item.tipe === 'masuk' ? '#16a34a' : '#dc2626' },
        ]}
      >
        {item.tipe === 'masuk' ? '+' : '-'} Rp{' '}
        {item.nominal.toLocaleString('id-ID')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />

      {/* Header Saldo */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Saldo Kamu</Text>
        <Text style={styles.headerSaldo}>
          Rp {saldo.toLocaleString('id-ID')}
        </Text>
        <View style={styles.headerRow}>
          <View style={styles.headerSub}>
            <Text style={styles.headerSubLabel}>Pemasukan</Text>
            <Text style={styles.headerSubValue}>
              Rp{' '}
              {transaksi
                .filter((t) => t.tipe === 'masuk')
                .reduce((s, t) => s + t.nominal, 0)
                .toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.headerSub}>
            <Text style={styles.headerSubLabel}>Pengeluaran</Text>
            <Text style={[styles.headerSubValue, { color: '#fca5a5' }]}>
              Rp{' '}
              {transaksi
                .filter((t) => t.tipe === 'keluar')
                .reduce((s, t) => s + t.nominal, 0)
                .toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
      </View>

      {/* Form Input */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Tambah Transaksi</Text>
        <TextInput
          style={styles.input}
          placeholder="Deskripsi (contoh: Beli Makan)"
          placeholderTextColor="#9ca3af"
          value={deskripsi}
          onChangeText={setDeskripsi}
        />
        <TextInput
          style={styles.input}
          placeholder="Nominal (contoh: 50000)"
          placeholderTextColor="#9ca3af"
          value={nominal}
          onChangeText={setNominal}
          keyboardType="numeric"
        />
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnMasuk]}
            onPress={() => tambahTransaksi('masuk')}
          >
            <Text style={styles.btnText}>+ Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnKeluar]}
            onPress={() => tambahTransaksi('keluar')}
          >
            <Text style={styles.btnText}>- Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List Riwayat Transaksi */}
      <Text style={styles.listTitle}>Riwayat Transaksi</Text>
      <FlatList
        data={[...transaksi].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada transaksi, Bro!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  // Header
  header: {
    backgroundColor: '#1e40af',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerLabel: {
    color: '#93c5fd',
    fontSize: 14,
    marginBottom: 4,
  },
  headerSaldo: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  headerSub: { alignItems: 'center' },
  headerSubLabel: { color: '#bfdbfe', fontSize: 12 },
  headerSubValue: { color: '#ffffff', fontSize: 14, fontWeight: '600', marginTop: 2 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  // Form
  form: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    marginBottom: 10,
  },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnMasuk: { backgroundColor: '#16a34a' },
  btnKeluar: { backgroundColor: '#dc2626' },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  // List
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  itemRow: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemIcon: { fontSize: 18, marginRight: 10, color: '#64748b' },
  itemKet: { fontSize: 14, color: '#1e293b', flex: 1 },
  itemNominal: { fontSize: 14, fontWeight: '700' },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 40,
    fontSize: 14,
  },
});