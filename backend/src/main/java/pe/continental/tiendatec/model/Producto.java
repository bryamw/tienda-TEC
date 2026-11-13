package pe.continental.tiendatec.model;
public record Producto(long id, String nombre, String categoria, double precio,
                       String imagen, String descripcion, int stock) {}
