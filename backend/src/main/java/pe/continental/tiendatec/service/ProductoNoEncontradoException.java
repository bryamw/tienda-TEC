package pe.continental.tiendatec.service;
public class ProductoNoEncontradoException extends RuntimeException {
  public ProductoNoEncontradoException(long id) { super("No existe el producto con ID " + id); }
}
