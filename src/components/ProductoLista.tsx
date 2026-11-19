import { useEffect, useState, type FormEvent } from 'react';
import {
    eliminarProducto,
    obtenerProductos,
    type CursorProducto,
    type DireccionPaginacion,
    type FiltrosProducto,
    type PaginaProductos,
    type Producto,
    type RangoProducto,
} from '../services/productoService';

interface Props {
    onEditar: (producto: Producto) => void;
}

const PRODUCTOS_POR_PAGINA = 5;
const PAGINA_VACIA: PaginaProductos = {
    productos: [],
    primerDocumento: null,
    ultimoDocumento: null,
    haySiguiente: false,
};

export const ProductoLista = ({ onEditar }: Props) => {
    const [pagina, setPagina] = useState<PaginaProductos>(PAGINA_VACIA);
    const [filtros, setFiltros] = useState<FiltrosProducto>({});
    const [numeroPagina, setNumeroPagina] = useState(1);
    const [cursor, setCursor] = useState<CursorProducto | null>(null);
    const [direccion, setDireccion] = useState<DireccionPaginacion>('siguiente');
    const [errorConsulta, setErrorConsulta] = useState('');
    const [stockMinimo, setStockMinimo] = useState('');
    const [stockMaximo, setStockMaximo] = useState('');
    const [precioMinimo, setPrecioMinimo] = useState('');
    const [precioMaximo, setPrecioMaximo] = useState('');
    const [errorFiltro, setErrorFiltro] = useState('');

    const productos = pagina.productos;

    useEffect(() => {
        return obtenerProductos(
            (paginaActualizada) => {
                setPagina(paginaActualizada);
                setErrorConsulta('');
            },
            (error) => {
                console.error('Error al obtener los productos: ', error);
                setErrorConsulta(error.message);
            },
            { filtros, limite: PRODUCTOS_POR_PAGINA, cursor, direccion },
        );
    }, [filtros, cursor, direccion]);

    const handleAplicarFiltros = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const rangoStock = leerRango(stockMinimo, stockMaximo, 'stock');
        const rangoPrecio = leerRango(precioMinimo, precioMaximo, 'precio');

        if (rangoStock.error || rangoPrecio.error) {
            setErrorFiltro(rangoStock.error ?? rangoPrecio.error ?? '');
            return;
        }

        setErrorFiltro('');
        setFiltros({
            stock: rangoStock.rango,
            precio: rangoPrecio.rango,
        });
        setCursor(null);
        setDireccion('siguiente');
        setNumeroPagina(1);
    };

    const handleLimpiarFiltros = () => {
        setStockMinimo('');
        setStockMaximo('');
        setPrecioMinimo('');
        setPrecioMaximo('');
        setErrorFiltro('');
        setFiltros({});
        setCursor(null);
        setDireccion('siguiente');
        setNumeroPagina(1);
    };

    const handlePaginaAnterior = () => {
        if (numeroPagina <= 1 || !pagina.primerDocumento) {
            return;
        }

        setCursor(pagina.primerDocumento);
        setDireccion('anterior');
        setNumeroPagina((numeroActual) => numeroActual - 1);
    };

    const handlePaginaSiguiente = () => {
        if (!pagina.haySiguiente || !pagina.ultimoDocumento) {
            return;
        }

        setCursor(pagina.ultimoDocumento);
        setDireccion('siguiente');
        setNumeroPagina((numeroActual) => numeroActual + 1);
    };

    const handleEliminarProducto = async (id: string) => {
        try {
            await eliminarProducto(id);
        } catch (error) {
            console.error('Error al eliminar el producto: ', error);
        }
    };

    return (
        <div className="product-list">
            <div className="list-heading">
                <div>
                    <p className="eyebrow">Inventario</p>
                    <h2>Productos</h2>
                </div>
                <span className="product-count">
                    {productos.length} {productos.length === 1 ? 'producto' : 'productos'} en esta página
                </span>
            </div>

            <form className="product-filters" onSubmit={handleAplicarFiltros}>
                <p className="filter-title">Filtrar por rango</p>
                <div className="filter-fields">
                    <fieldset className="filter-group">
                        <legend>Stock</legend>
                        <label>
                            Desde
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={stockMinimo}
                                onChange={(event) => setStockMinimo(event.target.value)}
                                placeholder="Mínimo"
                            />
                        </label>
                        <label>
                            Hasta
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={stockMaximo}
                                onChange={(event) => setStockMaximo(event.target.value)}
                                placeholder="Máximo"
                            />
                        </label>
                    </fieldset>
                    <fieldset className="filter-group">
                        <legend>Precio</legend>
                        <label>
                            Desde
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={precioMinimo}
                                onChange={(event) => setPrecioMinimo(event.target.value)}
                                placeholder="Mínimo"
                            />
                        </label>
                        <label>
                            Hasta
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={precioMaximo}
                                onChange={(event) => setPrecioMaximo(event.target.value)}
                                placeholder="Máximo"
                            />
                        </label>
                    </fieldset>
                </div>
                {errorFiltro && <p className="filter-error" role="alert">{errorFiltro}</p>}
                <div className="filter-actions">
                    <button className="button button-primary" type="submit">Aplicar filtros</button>
                    <button className="button button-page" type="button" onClick={handleLimpiarFiltros}>
                        Limpiar
                    </button>
                </div>
            </form>

            <div className="table-scroll">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th scope="col">Producto</th>
                            <th scope="col">ID</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {errorConsulta ? (
                            <tr>
                                <td className="empty-state" colSpan={5}>
                                    <strong>No se pudieron cargar los productos</strong>
                                    <span>{errorConsulta}</span>
                                </td>
                            </tr>
                        ) : productos.length === 0 ? (
                            <tr>
                                <td className="empty-state" colSpan={5}>
                                    <strong>{filtros.stock || filtros.precio ? 'No hay productos en ese rango' : 'Aún no hay productos'}</strong>
                                    <span>
                                        {filtros.stock || filtros.precio
                                            ? 'Prueba con otros valores o limpia los filtros.'
                                            : 'Agrega un producto con el formulario para comenzar.'}
                                    </span>
                                </td>
                            </tr>
                        ) : (
                            productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="product-name-cell">
                                        <span className="product-avatar" aria-hidden="true">
                                            {producto.nombre.trim().charAt(0).toUpperCase() || '?'}
                                        </span>
                                        <span className="product-name">{producto.nombre}</span>
                                    </td>
                                    <td className="id-cell">{producto.id}</td>
                                    <td>{producto.precio.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td><span className="stock-badge">{producto.stock}</span></td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="button button-subtle" onClick={() => onEditar(producto)}>
                                                Editar
                                            </button>
                                            <button className="button button-danger" onClick={() => handleEliminarProducto(producto.id!)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls" aria-label="Paginación de productos">
                <span className="pagination-note">Página {numeroPagina}</span>
                <div className="pagination-buttons">
                    <button
                        className="button button-page"
                        type="button"
                        onClick={handlePaginaAnterior}
                        disabled={numeroPagina === 1 || !pagina.primerDocumento}
                    >
                        Anterior
                    </button>
                    <button
                        className="button button-page"
                        type="button"
                        onClick={handlePaginaSiguiente}
                        disabled={!pagina.haySiguiente || !pagina.ultimoDocumento}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )

}

const leerRango = (
    minimoTexto: string,
    maximoTexto: string,
    campo: string,
): { rango?: RangoProducto; error?: string } => {
    if (!minimoTexto && !maximoTexto) {
        return {};
    }

    if (!minimoTexto || !maximoTexto) {
        return { error: `Completa los valores mínimo y máximo para ${campo}.` };
    }

    const minimo = Number(minimoTexto);
    const maximo = Number(maximoTexto);

    if (!Number.isFinite(minimo) || !Number.isFinite(maximo) || minimo < 0 || maximo < 0) {
        return { error: `Ingresa valores válidos y no negativos para ${campo}.` };
    }

    if (minimo > maximo) {
        return { error: `El valor mínimo de ${campo} no puede superar el máximo.` };
    }

    return { rango: { minimo, maximo } };
};