import { useState } from 'react';
import ProductoForm from './components/ProductoForm'
import { ProductoLista } from './components/ProductoLista'
import type { Producto } from './services/productoService'
import './App.css'

function App() {

  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">P</div>
        <div>
          <p className="eyebrow">Panel de administración</p>
          <h1>Gestión de productos</h1>
          <p className="app-description">Administra tu inventario desde un solo lugar.</p>
        </div>
      </header>

      <div className="app-layout">
        <section className="panel form-panel" aria-label="Formulario de producto">
          <ProductoForm
            key={productoEditar?.id ?? 'nuevo'}
            productoEditar={productoEditar}
            onGuardado={() => setProductoEditar(null)}
            onCancelar={() => setProductoEditar(null)}
          />
        </section>
        <section className="panel list-panel" aria-label="Listado de productos">
          <ProductoLista onEditar={setProductoEditar} />
        </section>
      </div>
    </main>
  )
}

export default App
