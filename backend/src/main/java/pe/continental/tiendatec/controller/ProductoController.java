package pe.continental.tiendatec.controller;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.continental.tiendatec.model.Producto;
import pe.continental.tiendatec.service.ProductoService;
import pe.continental.tiendatec.service.ProductoNoEncontradoException;
@RestController @RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ProductoController {
  private final ProductoService service;
  public ProductoController(ProductoService service) { this.service = service; }
  @GetMapping public List<Producto> listar(@RequestParam(required = false) String categoria) {
    return service.listar(categoria);
  }
  @GetMapping("/{id}") public Producto obtener(@PathVariable long id) { return service.obtener(id); }
  @ExceptionHandler(ProductoNoEncontradoException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String,String> noEncontrado(ProductoNoEncontradoException e) {
    return Map.of("error",e.getMessage());
  }
}
