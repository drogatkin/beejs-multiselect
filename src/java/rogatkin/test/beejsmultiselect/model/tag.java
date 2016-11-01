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
public class tag extends SimpleCoordinator<BeejsmultiselectModel> {
	public tag(BeejsmultiselectModel m) {
		super(m);
	}

	@DBField(key = true, auto = 1)
	@FormField(presentType = FieldType.Hidden)
	public long id;

	@DBField(size = 50, unique=true, index=true)
	@FormField()
	public String name;

	@DBField(size = 2000)
	@FormField(presentSize = 68, presentRows = 6)
	public String description;

	@DBField(index=true)
	public Date end_date;

}
         