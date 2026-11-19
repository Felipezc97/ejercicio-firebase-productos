import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	documentId,
	endBefore,
	limit,
	limitToLast,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where,
	type DocumentData,
	type QueryConstraint,
	type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Producto {
	id?: string;
	nombre: string;
	precio: number;
	stock: number;
}

export interface RangoProducto {
	minimo: number;
	maximo: number;
}

export interface FiltrosProducto {
	stock?: RangoProducto;
	precio?: RangoProducto;
}

export type DireccionPaginacion = 'siguiente' | 'anterior';
export type CursorProducto = QueryDocumentSnapshot<DocumentData>;

export interface PaginaProductos {
	productos: Producto[];
	primerDocumento: CursorProducto | null;
	ultimoDocumento: CursorProducto | null;
	haySiguiente: boolean;
}

export interface OpcionesConsultaProductos {
	filtros: FiltrosProducto;
	limite: number;
	cursor: CursorProducto | null;
	direccion: DireccionPaginacion;
}

export const guardarProducto = async (
	nombre: string,
	precio: number,
	stock: number,
) => {
	const docRef = await addDoc(collection(db, 'productos'), {
		nombre,
		precio,
		stock,
	});

	console.log('Producto agregado con ID: ', docRef.id);
	return docRef;
}

export const obtenerProductos = (
	onPaginaActualizada: (pagina: PaginaProductos) => void,
	onError: (error: Error) => void,
	opciones: OpcionesConsultaProductos,
) => {
	const restricciones: QueryConstraint[] = [];

	if (opciones.filtros.stock) {
		restricciones.push(
			where('stock', '>=', opciones.filtros.stock.minimo),
			where('stock', '<=', opciones.filtros.stock.maximo),
		);
	}

	if (opciones.filtros.precio) {
		restricciones.push(
			where('precio', '>=', opciones.filtros.precio.minimo),
			where('precio', '<=', opciones.filtros.precio.maximo),
		);
	}

	if (opciones.filtros.stock) {
		restricciones.push(orderBy('stock'));
	}

	if (opciones.filtros.precio) {
		restricciones.push(orderBy('precio'));
	}

	if (!opciones.filtros.stock && !opciones.filtros.precio) {
		restricciones.push(orderBy(documentId()));
	}

	const esPaginaAnterior = opciones.direccion === 'anterior' && opciones.cursor !== null;
	if (opciones.cursor) {
		restricciones.push(
			esPaginaAnterior
				? endBefore(opciones.cursor)
				: startAfter(opciones.cursor),
		);
	}

	restricciones.push(
		esPaginaAnterior
			? limitToLast(opciones.limite)
			: limit(opciones.limite + 1),
	);

	const productosQuery = query(collection(db, 'productos'), ...restricciones);

	return onSnapshot(productosQuery, (querySnapshot) => {
		const documentosVisibles = esPaginaAnterior
			? querySnapshot.docs
			: querySnapshot.docs.slice(0, opciones.limite);
		const productos = documentosVisibles.map((doc) => ({
			id: doc.id,
			...doc.data()
		})) as Producto[];

		onPaginaActualizada({
			productos,
			primerDocumento: documentosVisibles[0] ?? null,
			ultimoDocumento: documentosVisibles[documentosVisibles.length - 1] ?? null,
			haySiguiente: esPaginaAnterior || querySnapshot.docs.length > opciones.limite,
		});
	}, onError);
}

export const actualizarProducto = async(
	id: string,
	nombre: string,
	precio: number,
	stock: number
) => {
	const productoRef = doc(db, 'productos', id);
	await updateDoc(productoRef, {
		nombre,
		precio,
		stock
	});
}

export const eliminarProducto = async (id: string) => {
	const productoRef = doc(db, 'productos', id);
	await deleteDoc(productoRef);
}