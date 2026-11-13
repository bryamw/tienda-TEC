package pe.continental.tiendatec.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import pe.continental.tiendatec.model.Producto;
@Repository public class ProductoRepository {
  // Datos de ejemplo en memoria: se reemplazarían por una BD en el proyecto final.
  private final List<Producto> productos = List.of(
    new Producto(1,"Laptop HP 240 G7","Laptops",1299,"/img/laptop 1 HP-240-G7-N4100-2.jpg","Laptop práctica para estudiar y trabajar.",10),
    new Producto(2,"Laptop Gamer ASUS GX551QM","Laptops",4899,"/img/laptop 2 gamer asus GX551QM.jpg","Equipo gamer para alto rendimiento.",10),
    new Producto(3,"iPhone 18 Pro","Smartphones",5499,"/img/iphone 18 pro 1.jpg","Smartphone premium de última generación.",10),
    new Producto(4,"Samsung Galaxy S26 Ultra","Smartphones",5299,"/img/sansung galaxy s26 ultra 2.jpg","Tecnología móvil para tu día a día.",10),
    new Producto(5,"Audífonos Inalámbricos","Audífonos",199,"/img/audifonos 1.png","Escucha tu música sin cables.",10),
    new Producto(6,"Audífonos Bluetooth","Audífonos",149,"/img/audifonos 2.jpg","Sonido y comodidad en cualquier lugar.",10)
  );
  public List<Producto> listar() { return productos; }
  public Optional<Producto> buscarPorId(long id) { return productos.stream().filter(p -> p.id() == id).findFirst(); }
}
