package rogatkin.test.beejsmultiselect.model;

import java.util.Date;

import org.aldan3.annot.DBField;
import org.aldan3.annot.DataRelation;
import org.aldan3.annot.FormField;
import org.aldan3.annot.FormField.FieldType;

import com.beegman.webbee.util.SimpleCoordinator;
// TODO insert it conditionally when drop downs requested
import com.beegman.webbee.util.GenericResourceOptions;

@DataRelation
public class book extends SimpleCoordinator<BeejsmultiselectModel> {
	public book(BeejsmultiselectModel m) {
		super(m);
	}

	@DBField(key = true, auto = 1)
	@FormField(presentType = FieldType.Hidden)
	public long id;

	@DBField(size = 250, index=true)
	@FormField(required=true)
	public String name;

	@DBField(size = 100, index=true)
	@FormField()
	public String author;

	@DBField(size = 4000)
	@FormField(presentSize = 68, presentRows = 6)
	public String description;

	@DBField(index=true)
	@FormField()
	public Date written_on;

}
         