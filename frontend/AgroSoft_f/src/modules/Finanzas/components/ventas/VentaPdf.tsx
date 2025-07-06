import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { formatCurrency } from '../../hooks/useCosechasGrouped';
import { UnidadesMedida } from '../../types';

interface VentaCosechaPDF {
  cosecha: {
    id: number;
    nombreEspecie: string;
  };
  cantidad: number;
  unidad_medida: UnidadesMedida;
  precio_unitario: string;
  descuento: string;
  valor_total: string;
}

interface VentaPDF {
  numero_factura: string;
  fecha: string;
  usuario: string;
  cosechas: VentaCosechaPDF[];
  valor_total: string;
}

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 12, color: '#374151' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logo: { width: 80, height: 80 },
  companyInfo: { textAlign: 'right', fontSize: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#15803d', marginBottom: 10 },
  table: { border: '1px solid #e5e7eb', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #e5e7eb' },
  tableHeader: { backgroundColor: '#f0fdf4', fontWeight: 'bold', padding: 8 },
  tableCell: { padding: 8, flex: 1, fontSize: 10 },
  totalSection: { marginTop: 10, alignItems: 'flex-end' },
  totalAmount: { fontSize: 12, fontWeight: 'bold', color: '#15803d' },
});

const Header = ({ numero_factura, fecha, usuario }: { numero_factura: string; fecha: string; usuario: string }) => (
  <View style={styles.header}>
    <Image src='../../../../../public/logoAgrosoft.png' style={styles.logo} />
    <View style={styles.companyInfo}>
      <Text style={styles.title}>Factura de Venta</Text>
      <Text>Factura #{numero_factura}</Text>
      <Text>Fecha: {format(new Date(fecha), 'dd/MM/yyyy')}</Text>
      <Text>Usuario: {usuario}</Text>
    </View>
  </View>
);

const Table = ({ cosechas }: { cosechas: VentaCosechaPDF[] }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={[styles.tableCell, { flex: 2 }]}>Producto</Text>
      <Text style={styles.tableCell}>Cantidad</Text>
      <Text style={styles.tableCell}>Unidad</Text>
      <Text style={styles.tableCell}>Precio Unitario</Text>
      <Text style={styles.tableCell}>Descuento (%)</Text>
      <Text style={styles.tableCell}>Total</Text>
    </View>
    {cosechas.map((item, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>{item.cosecha.nombreEspecie}</Text>
        <Text style={styles.tableCell}>{item.cantidad}</Text>
        <Text style={styles.tableCell}>{item.unidad_medida.nombre}</Text>
        <Text style={styles.tableCell}>{formatCurrency(Number(item.precio_unitario))}</Text>
        <Text style={styles.tableCell}>{item.descuento}</Text>
        <Text style={styles.tableCell}>{formatCurrency(Number(item.valor_total))}</Text>
      </View>
    ))}
  </View>
);

const Totals = ({ valor_total }: { valor_total: string }) => (
  <View style={styles.totalSection}>
    <Text style={styles.totalAmount}>Total: {formatCurrency(Number(valor_total))}</Text>
  </View>
);

export const FacturaPDF = ({ venta }: { venta: VentaPDF }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header numero_factura={venta.numero_factura} fecha={venta.fecha} usuario={venta.usuario} />
      <Table cosechas={venta.cosechas} />
      <Totals valor_total={venta.valor_total} />
    </Page>
  </Document>
);