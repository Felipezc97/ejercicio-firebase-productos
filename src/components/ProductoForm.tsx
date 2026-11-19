import { useState, type SyntheticEvent } from 'react';
import { guardarProducto, actualizarProducto, type Producto } from '../services/productoService';

interface Props {
  productoEditar: Producto | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

function ProductoForm({ productoEditar, onGuardado, onCancelar }: Props) {
	const [nombre, setNombre] = useState(productoEditar ? productoEditar.nombre : '');
	const [precio, setPrecio] = useState(productoEditar ? productoEditar.precio.toString() : '');
	const [stock, setStock] = useState(productoEditar ? productoEditar.stock.toString() : '');

	const limpiarCampos = () => {
		setNombre('');
		setPrecio('');
		setStock('');
	};

	const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		
		e.preventDefault();

		if (productoEditar) {
				try {
					await actualizarProducto(
						productoEditar.id!, 
						nombre,
						parseFloat(precio), 
						parseInt(stock, 10)
					);
					onGuardado();
					console.log('Producto actualizado correctamente');
				} catch (error) {
					console.error('Error al actualizar el producto: ', error);
				}			
			} else {
				try {
					const productoCreado =  await guardarProducto(
						nombre, 
						parseFloat(precio),
						parseInt(stock, 10)
					);
					console.log('Producto agregado correctamente con ID: ', productoCreado.id);
					limpiarCampos();
				} catch (error) {
					console.error('Error al agregar el producto: ', error);
				}
				
			}
	};

	return (
		<div className="product-form-card">
			<div className="form-heading">
				<p className="eyebrow">{productoEditar ? 'Edición' : 'Nuevo registro'}</p>
				<h2>{productoEditar ? 'Editar producto' : 'Agregar producto'}</h2>
				<p className="section-description">
					{productoEditar ? 'Modifica los datos del producto.' : 'Completa los datos para agregarlo al inventario.'}
				</p>
			</div>
			<form className="product-form" onSubmit={handleSubmit}>
				<label className="form-field" htmlFor="nombre">
					<span>Nombre</span>
					<input
						type="text"
						placeholder="Ej. Teclado inalámbrico"
						id="nombre"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
					/>
				</label>
				<label className="form-field" htmlFor="precio">
					<span>Precio</span>
					<input
						type="number"
						placeholder="0.00"
						id="precio"
						value={precio}
						onChange={(e) => setPrecio(e.target.value)}
					/>
				</label>
				<label className="form-field" htmlFor="stock">
					<span>Stock disponible</span>
					<input
						type="number"
						placeholder="0"
						id="stock"
						value={stock}
						onChange={(e) => setStock(e.target.value)}
					/>
				</label>
				<div className={productoEditar ? 'form-actions' : undefined}>
					<button className="button button-primary submit-button" type="submit">
						{productoEditar ? 'Guardar cambios' : 'Agregar producto'}
					</button>
					{productoEditar && (
						<button className="button button-cancel" type="button" onClick={onCancelar}>
							Cancelar
						</button>
					)}
				</div>
			</form>
		</div>
	);
}

export default ProductoForm;
