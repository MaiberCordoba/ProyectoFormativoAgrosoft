import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { formatCurrency } from '../../hooks/useCosechasGrouped';
import { UnidadesMedida } from '../../types';
import logoAgrosoft from '../../../../../public/logoAgrosoft.png';

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
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  container: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logosDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  logo: {
    height: 50,
    width: 'auto',
  },
  titleContainer: {
    textAlign: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#003366',
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 10,
    marginTop: 5,
    color: '#555',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    fontSize: 9,
    padding: 8,
    border: '1px solid #003366',
  },
  table: {
    border: '1px solid #003366',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
  },
  tableRowAlternate: {
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
  },
  tableHeader: {
    backgroundColor: '#003366', 
    fontWeight: 'bold',
    padding: 6,
    fontSize: 9,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableCell: {
    padding: 6,
    flex: 1,
    fontSize: 8,
    borderRight: '1px solid #e0e0e0',
    textAlign: 'center',
  },
  tableCellLeft: {
    padding: 6,
    flex: 2,
    fontSize: 8,
    borderRight: '1px solid #e0e0e0',
    textAlign: 'left',
  },
  tableCellLast: {
    padding: 6,
    flex: 1,
    fontSize: 8,
    textAlign: 'center',
  },
  totalSection: {
    marginTop: 8,
    alignItems: 'flex-end',
    borderTop: '1px solid #003366',
    paddingTop: 8,
    paddingRight: 8,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#003366',
    fontFamily: 'Helvetica-Bold',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666',
    borderTop: '1px solid #003366',
    paddingTop: 5,
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 7,
    color: '#666',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 8,
  },
});

const Header = () => (
  <View style={styles.header}>
    <View style={styles.logosContainer}>
      <Image src={logoAgrosoft} style={styles.logo} />
    </View>
    <View>
      <Text style={{ fontSize: 8 }}>{new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</Text>
    </View>
  </View>
);

const InvoiceInfo = ({ numero_factura, fecha, usuario }: { numero_factura: string; fecha: string; usuario: string }) => (
  <View style={styles.invoiceInfo}>
    <View>
      <Text style={{ fontWeight: 'bold', fontFamily: 'Helvetica-Bold' }}>Factura Electrónica #{numero_factura}</Text>
      <Text>Fecha: {format(new Date(fecha), 'dd/MM/yyyy')}</Text>
    </View>
    <View>
      <Text style={{ fontWeight: 'bold', fontFamily: 'Helvetica-Bold' }}>Emitido por:</Text>
      <Text>{usuario}</Text>
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
      <Text style={styles.tableCellLast}>Total</Text>
    </View>
    {cosechas.map((item, index) => (
      <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
        <Text style={styles.tableCellLeft}>{item.cosecha.nombreEspecie}</Text>
        <Text style={styles.tableCell}>{item.cantidad}</Text>
        <Text style={styles.tableCell}>{item.unidad_medida.nombre}</Text>
        <Text style={styles.tableCell}>{formatCurrency(Number(item.precio_unitario))}</Text>
        <Text style={styles.tableCell}>{item.descuento}</Text>
        <Text style={styles.tableCellLast}>{formatCurrency(Number(item.valor_total))}</Text>
      </View>
    ))}
  </View>
);

const Totals = ({ valor_total }: { valor_total: string }) => (
  <View style={styles.totalSection}>
    <Text style={styles.totalLabel}>Total Factura</Text>
    <Text style={styles.totalAmount}>{formatCurrency(Number(valor_total))}</Text>
  </View>
);

const Metadata = () => (
  <View style={styles.metadata}>
    <Text>Regional  Huila</Text>
    <Text>Agrosoft</Text>
  </View>
);

const Footer = () => (
  <View style={styles.footer}>
    <Text>Gracias por su compra.</Text>
    <Text>Factura electrónica generada por Agrosoft</Text>
    <Text>Términos de pago: Pago al contado.</Text>
    <Text>© 2025 Agrosoft. - Todos los derechos reservados</Text>
  </View>
);

export const FacturaPDF = ({ venta }: { venta: VentaPDF }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Header />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Factura Electrónica</Text>
          <Text style={styles.subtitle}>Sistema de Gestión Agrosoft</Text>
        </View>
        <InvoiceInfo numero_factura={venta.numero_factura} fecha={venta.fecha} usuario={venta.usuario} />
        <Table cosechas={venta.cosechas} />
        <Totals valor_total={venta.valor_total} />
        <Metadata />
        <Footer />
      </View>
    </Page>
  </Document>
);