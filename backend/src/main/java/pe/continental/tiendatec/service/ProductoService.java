package pe.continental.tiendatec.service;
import java.util.List;
import org.springframework.stereotype.Service;
import pe.continental.tiendatec.model.Producto;
import pe.continental.tiendatec.repository.ProductoRepository;
@Service public class ProductoService {
  private final ProductoRepository repository;
  public ProductoService(ProductoRepository repository) { this.repository = repository; }
  public List<Producto> listar(String categoria) {
    List<Producto> todos = repository.listar();
    if (categoria == null || categoria.isBlank()) return todos;
    return todos.stream().filter(p -> p.categoria().equalsIgnoreCase(categoria.trim())).toList();
  }
  public Producto obtener(long id) { return repository.buscarPorId(id)
    .orElseThrow(() -> new ProductoNoEncontradoException(id)); }
}
