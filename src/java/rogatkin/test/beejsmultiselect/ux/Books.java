package rogatkin.test.beejsmultiselect.ux;

import org.aldan3.model.ProcessException;
import org.aldan3.data.DODelegator;
import org.aldan3.model.DataObject;
import org.aldan3.annot.DataRelation;
import com.beegman.webbee.block.SqlTabular;

import rogatkin.test.beejsmultiselect.model.BeejsmultiselectModel;
@DataRelation(query="select ID,NAME,DESCRIPTION,AUTHOR,WRITTEN_ON from book where name like '%:name%' or author like '%:name%'", keys={"name"})
public class Books extends SqlTabular<DataObject,BeejsmultiselectModel> {
}
